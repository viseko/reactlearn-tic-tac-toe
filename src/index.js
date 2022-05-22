import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />)
    ;
  }

  drawSquares() {
    const rows = [];

    let squareNum = 0;
    for (let i = 0; i < 3; i++) {
      const squares = [];
      
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(squareNum++));
      }

      rows.push(
        <div className="board-row">
          {squares}
        </div>
      )
    }

    return rows;
  }

  render() {
    return (
      <div>
        {this.drawSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(0).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history.at(-1);
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    console.log(i);

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
        `Перейти к шагу #${move}` :
        "В начало игры";

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    });

    let status;

    if (winner) {
      status = `Победитель: ${winner}`;
    } else {
      status = `След. игрок: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-status">
          {status}
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}