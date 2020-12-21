import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import img1 from "./images/(1).jpg";

const styles = {
  transition: 'all 1s ease-out'
}

class Square extends React.Component {
  
  render() {
    //let src = "img" + this.props.value
    //<img onError={console.log("bug image: " + src)} className="img" src={img1} alt="P"></img>
    return (
      <button className="square" style={{...styles, opacity: this.props.opacity }}
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: [],
      squares_print: [],

      //-1 si pas d'information, sinon id de la case
      //false si mauvaise paire, true si bonne paire
      result: [-1, -1, false], 
      
      nbPairs: 10,
      nbPairsFind: 0,

      score: [0,0],
      nickname1: "nickname1",
      nickname2: "nickname2",
      oneIsNext: true,
      infos: " | Start pour jouer",

      cXr: 0,
      col: 0,

      opacity: 1
    };
    this.handleFormPairs = this.handleFormPairs.bind(this)
    this.handleFormNick1 = this.handleFormNick1.bind(this)
    this.handleFormNick2 = this.handleFormNick2.bind(this)
  }

  setGame() {

    this.setState((prevstate) => {
      

      let col = 1
      let cXr = 0
      console.log("cXr :" + cXr)
      // On cherche à avoir un carré peut importe le nombre de paires
      while (cXr <= prevstate.nbPairs*2) { //tant que colonne * ligne < nombre de cartes
        col+=1
        cXr = Math.pow(col,2)
        console.log("cXr :" + cXr)
      }
      console.log("col: " + col + " | cXr: "+ cXr + " | " + this.state.nbPairs*2)


      console.log("nbPairs: " + prevstate.nbPairs)
      let squares_print = Array(parseInt(prevstate.nbPairs, 10) * 2).fill(null)
      squares_print = squares_print.concat(Array(cXr-this.state.nbPairs).fill("-"))
      console.log("squares_print :" + squares_print)

      let squares = [...Array(parseInt(prevstate.nbPairs, 10)).keys()]
      squares = shuffle(squares.concat([...Array(parseInt(prevstate.nbPairs, 10)).keys()]))
      console.log("squares :" + squares)

      return {
        squares: squares,
        squares_print: squares_print,
        result: [-1, -1, false],
        nbPairsFind: 0,
        score: [0,0],
        infos: " | GO!",
        oneIsNext: true,
        cXr: cXr,
        col: col
      };
    });
  }

  handleSquareClick(i) {

    this.setState((prevstate) => {

      let result = { ...prevstate.result }
      let squares = { ...prevstate.squares }
      let squares_print = { ...prevstate.squares_print }
      let score = prevstate.score
      let nbPairsFind = prevstate.nbPairsFind
      let oneIsNext = prevstate.oneIsNext
      let infos = ""
      let p = oneIsNext ? 0 : 1

      //2 cartes d'affichés
      console.log(result)
      if (result[0] !== -1 && result[1] !== -1) {
        if (result[2] === false) {
          squares_print[result[0]] = null
          squares_print[result[1]] = null
          console.log("erase")
        }
        result = [-1, -1, false]


        //0 cartes d'affichés
      }
      if (result[0] === -1 && result[1] === -1) {
        if (squares_print[i] === null) {
          result[0] = i
          squares_print[i] = squares[i]
          console.log("0")

        } else if (typeof squares[i] === 'undefined'){
          infos = " | Pas une carte"
        } else {
          infos = " | Déjà retourné"
        }


        //1 cartes d'affichés
      } else if (result[1] === -1) {
        if (squares_print[i] === null) {
          result[1] = i
          squares_print[i] = squares[i]
          console.log("1")
          console.log("compare")
          if (result[0] !== result[1] && squares[result[0]] === squares[result[1]]) {
            squares_print[result[0]] = squares[result[0]]
            squares_print[result[1]] = squares[result[1]]
            result[2] = true
            console.log("true")
            score[p] = score[p] + 3
            nbPairsFind += 1
          } else {
            result[2] = false
            console.log("false")
            score[p] = score[p] - 1
          }

        } else if (typeof squares[i] === 'undefined'){
          infos = " | Pas une carte"
        } else {
          infos = " | Déjà retourné"
        }

        console.log("player: " + p)
        console.log("score 0: " + score[0])
        console.log("score 1: " + score[1])
        oneIsNext = !oneIsNext
        console.log("oneIsNext: " + oneIsNext)
      }
      if (nbPairsFind === prevstate.nbPairs) {
        infos = "Gagné!"
      }

      return {
        squares: squares,
        squares_print: squares_print,
        result: result,
        score: score,
        nbPairsFind: nbPairsFind,
        infos: infos,
        oneIsNext: oneIsNext,
        opacity: 0,
      };
    });
  }

  handleFormPairs(event) {
    this.setState(() => {
      return{
        nbPairs: event.target.value 
      }
    })
    console.log(this.state.nbPairs)
  }

  handleFormNick1(event) {
    this.setState(() => {
      return{
        nickname1: event.target.value 
      }
    })
    console.log(this.state.nickname1)
  }

  handleFormNick2(event) {
    this.setState(() => {
      return{
        nickname2: event.target.value 
      }
    })
    console.log(this.state.nickname2)
  }



  renderSquare(i) {
    return <Square value={this.state.squares_print[i]} opacity={this.state.opacity}
      key={i}
      onClick={() => this.handleSquareClick(i)} />;
  }

  createTable() {
    let table = []
    let k = 0
    let col = this.state.col

    for (let i = 0; i < col; i++) {
      let children = []
      for (let j = 0; j < col; j++) {
        children.push(this.renderSquare(k))
        k++
      }
      table.push(children)
      table.push(<div className="board-row" key={i}></div>)
    }
    return table
  }

  createTableScore() {
    let table = []
    let children = []

    children.push(this.state.score[0])
    children.push(this.state.nickname1)
    table.push(children)
    table.push(<div className="board-row" key={0}></div>)
    children.push(this.state.score[0])
    children.push(this.state.nickname0)
    table.push(children)
    table.push(<div className="board-row" key={1}></div>)
    return table

  }

  render() {

    let src = "./images/(" + 5 + ").jpg"
    console.log("src: " + src)

    let tour = "c'est au tour de: " + ((this.state.oneIsNext) ? this.state.nickname1 : this.state.nickname2)
    let status =this.state.infos
    let points = this.state.nickname1 + ": " + this.state.score[0] + "pts  |  " + this.state.nickname2 + ": " +  this.state.score[1] + "pts "

    return (
      <div>
        <form>
          <label>
            Joueur 1:
            <input style={{ width: '100px' }} value={this.state.nickname} type="text"
              onChange={this.handleFormNick1} 
              />
          </label>
        </form>
        <form>
          <label>
            Joueur 2:
            <input style={{ width: '100px' }} value={this.state.nickname} type="text"
              onChange={this.handleFormNick2} 
              />
          </label>
        </form>

        <div className="status">{points}</div>

        <button variant="primary"
          onClick={() => this.setGame()}>Start
        </button>{" "}{status}
        
        <div className="status">{tour}</div>
        {this.createTable()}
        <form>
          <label>
            Paires :
            <input style={{ width: '40px' }} value={this.state.nbPairs} type="number"
              onChange={this.handleFormPairs} 
              />
              {" | "}{this.state.nbPairs - this.state.nbPairsFind}{' paires restantes'}
          </label>
        </form>
          <img onError={console.log("bug image: " + src)} className="img" src={img1} alt="P"></img>
        <div>
          {this.createTableScore()}
        </div>
      </div>

    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}