import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for(let row = 0; row < nrows; row++){
      let rowArray = [];
      for(let col = 0; col < ncols; col++){
        rowArray.push(Math.random()<chanceLightStartsOn);
      }
      initialBoard.push(rowArray);
    }
    return initialBoard;
  }
  
  //check the board in state to determine whether the player has won.
  function hasWon() {
    for(let row = 0; row < nrows; row++){
      for(let col = 0; col < ncols; col++){
        if(board[row][col]) return false;
      }
    }

    return true;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [row, col] = coord.split("-").map(Number);

      const flipCell = (row, col, bC) => {
        // if this coord is actually on board, flip it

        if (row >= 0 && row < nrows && col >= 0 && col < ncols) {
          bC[row][col] = !bC[row][col];
        }
      };

      //Make a (deep) copy of the oldBoard
      let boardCopy = JSON.parse(JSON.stringify(oldBoard));

      //in the copy, flip this cell and the cells around it
      flipCell(row,col,boardCopy);
      if(row-1>-1) flipCell(row-1,col, boardCopy);
      if(col-1>-1) flipCell(row,col-1, boardCopy);
      if(row+1<nrows) flipCell(row+1, col, boardCopy);
      if(col+1<ncols) flipCell(row, col+1, boardCopy);

      //return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if(hasWon()){
    return (
      <h2 className="win-text">YOU WIN!</h2>
    );
  }

  return  (
    <div className="Board">
      <table>
        <tbody>
          {
            board.map((row, rnum) => 
              (<tr key={rnum}>
                {
                  row.map((light, cnum) => 
                    (<Cell key={rnum+"-"+cnum} isLit={light} flipCellsAroundMe={()=>flipCellsAround(rnum+"-"+cnum)}/>))
                }
              </tr>))
          }
        </tbody>
      </table>
    </div>
  )
  
}

export default Board;
