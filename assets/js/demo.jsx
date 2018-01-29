import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classNames from 'classnames';

export default function run_demo(root) {
  ReactDOM.render(<Demo side={0}/>, root);
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flippedCards :[],
      score : 0,
      matchedCount: 0,
      gameOver:false,
      gamePaused:false,
      tiles:_.shuffle([
        { character: "A", matched: false },
        { character: "B", matched: false },
        { character: "C", matched: false },
        { character: "D", matched: false },
        { character: "E", matched: false },
        { character: "F", matched: false },
        { character: "G", matched: false },
        { character: "H", matched: false },
        { character: "A", matched: false },
        { character: "B", matched: false },
        { character: "C", matched: false },
        { character: "D", matched: false },
        { character: "E", matched: false },
        { character: "F", matched: false },
        { character: "G", matched: false },
        { character: "H", matched: false },
      ] ) 
    };
  }
  
  onCardClickOuter(cardIndex) {
    if(this.state.gamePaused){
      return;
    }
		if(this.state.flippedCards.includes(cardIndex) ) {
      return;
		}
		this.state.flippedCards.push(cardIndex)
		this.setState({
			flippedCards: this.state.flippedCards
		})
		 if(this.state.flippedCards.length ==2) {
      this.setState({
        gamePaused: true
      })
      this.resetTime = setTimeout(() => {
         this.cardMatchCheck();
      },1000);
		 }
}

  gameOverFn(){
    this.resetTime = setTimeout(() => {
    this.setState({
      flippedCards :[],
      score : 0,
      matchedCount: 0,
      gameOver:false,
      gamePaused:false,
      tiles:_.shuffle([
        { character: "A", matched: false },
        { character: "B", matched: false },
        { character: "C", matched: false },
        { character: "D", matched: false },
        { character: "E", matched: false },
        { character: "F", matched: false },
        { character: "G", matched: false },
        { character: "H", matched: false },
        { character: "A", matched: false },
        { character: "B", matched: false },
        { character: "C", matched: false },
        { character: "D", matched: false },
        { character: "E", matched: false },
        { character: "F", matched: false },
        { character: "G", matched: false },
        { character: "H", matched: false },
      ] ) 
    });
   },7500);
  }


  cardMatchCheck(){
    var cardOne=this.state.flippedCards[0];
    var cardTwo=this.state.flippedCards[1];
    let character_list = _.map(this.state.tiles, (item, index) => {
        return item.character;
    });
    if(character_list[cardOne]===character_list[cardTwo]){
      let tile_list = _.map(this.state.tiles, (item, index) => {
        return item;
    });
    tile_list[cardOne].matched=true;
    tile_list[cardTwo].matched=true;
    this.state.score=this.state.score+10;
    this.state.matchedCount=this.state.matchedCount+1;
    this.setState({
      tiles: tile_list,
      flippedCards: [],
      score :this.state.score,
      gamePaused:false
    })
    if(this.state.matchedCount==8){
      this.setState({
        gameOver:true
    })
    this.gameOverFn();
  }
    }
    else{
      this.state.score=this.state.score-1;
      this.setState({
        flippedCards: [],
        score :this.state.score,
        gamePaused:false
      })
    }
  }
  restartGame(){
    this.resetTime = setTimeout(() => {
      this.setState({
        flippedCards :[],
        score : 0,
        matchedCount: 0,
        gameOver:false,
        gamePaused:false,
        tiles:_.shuffle([
          { character: "A", matched: false },
          { character: "B", matched: false },
          { character: "C", matched: false },
          { character: "D", matched: false },
          { character: "E", matched: false },
          { character: "F", matched: false },
          { character: "G", matched: false },
          { character: "H", matched: false },
          { character: "A", matched: false },
          { character: "B", matched: false },
          { character: "C", matched: false },
          { character: "D", matched: false },
          { character: "E", matched: false },
          { character: "F", matched: false },
          { character: "G", matched: false },
          { character: "H", matched: false },
        ] )
      });
     },500);
  }

  
  render() {

    let item_list = _.map(this.state.tiles, (item, index) => {
      return <Tile card={item} key={index} onCardClick={this.onCardClickOuter.bind(this, index)} isFlipped={this.state.flippedCards.includes(index)} />;
    });
    if(this.state.gameOver){
      return (
        <div className="row">
          <div className="col">
              <h1 className="text-center">You won!!! Wait or Restart Immediately</h1>
              <div className="col" >
                <h2 className="text-center">Total Score : {this.state.score}</h2>
                <div className="col">
                <Button onClick={this.restartGame.bind(this)}>Restart</Button>  
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

