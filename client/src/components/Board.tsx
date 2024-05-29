import { Cell } from "./Cell";
import { Notation } from "./Notation";
import { getRow, getColumn, getCoords } from "../utils/consts";
import {Droppable} from '../utils/Droppable';

interface Props {
  id: string;
  boardState: string[][];
  hoverState?: boolean[][];
  shipLayout?: string[][][];
  hoverColor: string;
  boardWidth: number;
  rows: number;
  cols: number;
  onMove: (cellid: string) => void;
  onHover: (cellid: string) => void;
}

function renderShip(r: string, c: string, shipLayout: string[][][]) {
  const [row, col] = getCoords(r + "-" + c);
  const ship = shipLayout[row][col][0];
  let image = null;
  if (ship === "empty") {
    return <></>;
  }
  if (ship === "carrier") {
    image = <img className="carrier" src={`./carrier.svg`} width="200" height="50" />;
  } else {
    image = <img src={`./${shipLayout[row][col][0]}.svg`} width="250" height="50" />;
  }
  return <div>{image}</div>;
}

export function Board({
  id,
  boardState,
  hoverState,
  shipLayout,
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
                    {shipLayout && renderShip(row, col, shipLayout)}
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
