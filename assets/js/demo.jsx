import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classNames from 'classnames';

export default function run_demo(root,channel) {
  ReactDOM.render(<Demo side={0} channel={channel}/>, root);
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state={
      flippedCards: [],
    score: 0,
    matchedCount: 0,
    gameOver: false,
    gamePaused: false,
    tiles : []};
    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);
    if(this.state.gameOver==true) {
      this.gameOverFn();
    }
  }


  onCardClickOuter(cardIndex) {
    if(this.state.gamePaused){
      return;
    }
		if(this.state.flippedCards.includes(cardIndex) ) {
      return;
		}
    this.channel.push("flippedCardsAdd" ,{flippedCard: cardIndex})
        .receive("ok", this.gotView.bind(this));
		 if(this.state.flippedCards.length ==1) {
       this.channel.push("gamePausedToggle" ,{toggleVal: true})
           .receive("ok", this.gotView.bind(this));
      this.resetTime = setTimeout(() => {
        this.channel.push("cardMatch",{flippedCard : this.state.flippedCards})
            .receive("ok", this.gotView.bind(this));
      },1200);
		 }
}

  gameOverFn(){
    this.resetTime = setTimeout(() => {
      this.channel.push("restart" , {restart : true})
          .receive("ok", this.gotView.bind(this));
      this.channel.push("restart")
          .receive("ok", this.gotView.bind(this));
   },7500);
  }

  restartGame(){
    this.resetTime = setTimeout(() => {
      this.channel.push("restart" , {restart : true})
          .receive("ok", this.gotView.bind(this));
      this.channel.push("restart")
          .receive("ok", this.gotView.bind(this));
   },2500);
  }

  render() {

    let item_list = _.map(this.state.tiles, (item, index) => {
      return <Tile card={item} key={index} onCardClick=
        {this.onCardClickOuter.bind(this, index)}
        isFlipped={this.state.flippedCards.includes(index)} />;
    });
    if(this.state.gameOver){
      return (
        <div className="row">
          <div className="col">
              <h1 className="text-center">You won!!! Wait or
                Restart Immediately</h1>
              <div className="col" >
                <h2 className="text-center">Total Score :
                  {this.state.score}</h2>
                <div className="col">
                <Button onClick={this.restartGame.bind(this)}>
                  Restart</Button>
                </div>
              </div>
        </div>
      </div>
      );
    }
    else{
    return (
      <div className="row">
        <div className="sectionClass">
        <div className="buttonDiv">
        <Button onClick={this.restartGame.bind(this)}>Restart</Button>
        </div>
        <div className="scoreDiv">
            <h2>Score : {this.state.score}</h2>
        </div>
      </div>
        <div className="sectionClass">
            {item_list}

      </div>
    </div>
    );
  }
  }
}

function Tile(params){
  var toFlip = params.isFlipped ? 'flipper' : 'flipped';
  if(params.card.matched){
    return (
      <div className="flip-container">
          <div className="flipped">
          <p className="matched">{params.card.character}</p>
          </div>
      </div>
    );
  }
  else{
    return (
      <div className="flip-container">
        <div className={toFlip}  onClick={params.onCardClick.bind(this)}>
          <div className="front">
          </div>
          <div className="back">
            <p className="character">{params.card.character}</p>
          </div>
        </div>
      </div>
    );
  }

}
