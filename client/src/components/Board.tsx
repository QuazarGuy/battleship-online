import { Cell } from "./Cell";
import { Notation } from "./Notation";
import { getRow, getColumn } from "../utils/consts";
import {Droppable} from '../utils/Droppable';

interface Props {
  id: string;
  boardState: string[][];
  hoverState?: boolean[][];
  hoverColor: string;
  boardWidth: number;
  rows: number;
  cols: number;
  onMove: (cellid: string) => void;
  onHover: (cellid: string) => void;
}

function renderShip(r: string, c: string, state: string) {
  const ship = state === "carrier" ? <img src="./carrier.svg" width="250" height="50" /> : null;
  return <div>{ship}</div>;
}

export function Board({
  id,
  boardState,
  hoverState,
  hoverColor,
  boardWidth,
  rows = 9,
  cols = 9,
  onMove,
  onHover,
}: Props) {
  const showBoardNotation = true;
  return (
    <div key={id} className="board">
      {[...Array(rows)].map((_, r) => {
        const row = getRow(r);
        return (
          <div
            key={`row-${row}`}
            className="row"
            style={{
              width: boardWidth,
            }}
          >
            {[...Array(cols)].map((_, c) => {
              const col = getColumn(c);
              return (
                <Droppable key={`droppable-${row}-${col}`} id={`${row}-${col}}`}>
                  <Cell
                    key={`${row}-${col}`}
                    cellid={`${row}-${col}`}
                    state={boardState[r][c]}
                    hover={hoverState ? hoverState[r][c] : false}
                    hoverColor={hoverColor}
                    // subtract width of cell and board borders
                    boardWidth={boardWidth-(cols+3)}
                    colCount={cols}
                    onMove={() => onMove(`${row}-${col}`)}
                    onHover={() => onHover(`${row}-${col}`)}
                  >
                    {showBoardNotation && (
                      <Notation row={row} col={col} boardWidth={boardWidth} />
                    )}
                    {renderShip(row, col, boardState[r][c])}
                  </Cell>
                </Droppable>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
