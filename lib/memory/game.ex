defmodule Memory.Game do
  def new do
    %{
      flippedCards: [],
      score: 0,
      matchedCount: 0,
      gameOver: false,
      gamePaused: false,
      tiles: get_list()
    }
  end

  def restart(game) do
    Map.put(game, :tiles, get_list())
    |> Map.put(:matchedCount, 0)
    |> Map.put(:score, 0)
    |> Map.put(:flippedCards, [])
    |> Map.put(:gamePaused, false)
    |> Map.put(:gameOver, false)
  end

   def client_view(game) do
     %{
       flippedCards: game.flippedCards,
       score: game.score,
       matchedCount: game.matchedCount,
       gameOver: game.gameOver,
       gamePaused: game.gamePaused,
       tiles: game.tiles
     }
  end

  def get_list() do
    tiles = [
      %{ character: "A", matched: false },
      %{ character: "B", matched: false },
      %{ character: "C", matched: false },
      %{ character: "D", matched: false },
      %{ character: "E", matched: false },
      %{ character: "F", matched: false },
      %{ character: "G", matched: false },
      %{ character: "H", matched: false },
      %{ character: "A", matched: false },
      %{ character: "B", matched: false },
      %{ character: "C", matched: false },
      %{ character: "D", matched: false },
      %{ character: "E", matched: false },
      %{ character: "F", matched: false },
      %{ character: "G", matched: false },
      %{ character: "H", matched: false },
    ]
    Enum.shuffle(tiles)
  end

  def flippedCardsAdd(game,cardId) do
    newFC = game.flippedCards
    |> MapSet.new()
    |> MapSet.put(cardId)
    |> MapSet.to_list

    Map.put(game, :flippedCards, newFC)
  end

  def gamePausedToggle(game,bool) do
    Map.put(game, :gamePaused, bool)
  end

  def cardMatchCheck(game,list) do
    tileOneChar=Enum.at(game.tiles,Enum.at(list,0)) |>Map.fetch(:character) |>IO.inspect(label: "tile one")
    tileTwoChar=Enum.at(game.tiles,Enum.at(list,1)) |>Map.fetch(:character) |>IO.inspect(label: "tile two")
    if(tileOneChar===tileTwoChar) do
      tileOne=Enum.at(game.tiles,Enum.at(list,0)) |> Map.replace(:matched , true)
      tileTwo=Enum.at(game.tiles,Enum.at(list,1)) |> Map.replace(:matched , true)
      newTilelist=
        List.replace_at(game.tiles, Enum.at(list,0), tileOne)
        |>List.replace_at(Enum.at(list,1), tileTwo)
        if(game.matchedCount===7) do
          Map.put(game, :tiles, newTilelist)
          |> Map.put(:matchedCount,game.matchedCount+1)
          |> Map.put(:score,game.score+10)
          |> Map.put(:flippedCards, [])
          |> Map.put(:gameOver, true)
          |> gamePausedToggle(false)
          |> IO.inspect(label: "game over")
        else
          Map.put(game, :tiles, newTilelist)
          |> Map.put(:matchedCount,game.matchedCount+1)
          |> Map.put(:score,game.score+10)
          |> Map.put(:flippedCards, [])
          |> gamePausedToggle(false)
          |> IO.inspect(label: "game state")
        end
    else
      Map.put(game, :flippedCards, [])
      |> Map.put(:score,game.score-1)
      |>gamePausedToggle(false)
    end
    #Map.put(game , :flippedCards , Enum.shuffle(list)) |> IO.inspect(label: "in game")
  end
end
