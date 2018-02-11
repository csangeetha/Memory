defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
        game = Memory.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("restart",%{"restart" => restart},socket) do
    game = Game.new()
    Memory.GameBackup.save(socket.assigns[:name], game)
    socket = socket
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("cardMatch",%{"flippedCard" => list} , socket) do
    game = Game.cardMatchCheck(socket.assigns[:game],list)
    Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end
  # ...
  def handle_in("flippedCardsAdd", %{"flippedCard" => cardId} ,socket) do
    game = Game.flippedCardsAdd(socket.assigns[:game], cardId)
      Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("gamePausedToggle", %{"toggleVal" => bool} ,socket) do
    game = Game.gamePausedToggle(socket.assigns[:game], bool)
      Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  def terminate(_msg,socket) do
    :ok
  end
end
