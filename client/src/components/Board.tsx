import { Cell } from "./Cell";
import { Notation } from "./Notation";
import { getRow, getColumn } from "../utils/consts";

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
                <Cell
                  key={`${row}-${col}`}
                  cellid={`${row}-${col}`}
                  state={boardState[r][c]}
                  hover={hoverState ? hoverState[r][c] : false}
                  hoverColor={hoverColor}
                  boardWidth={boardWidth}
                  colCount={cols}
                  onMove={() => onMove(`${row}-${col}`)}
                  onHover={() => onHover(`${row}-${col}`)}
                >
                  {showBoardNotation && (
                    <Notation row={row} col={col} boardWidth={boardWidth} />
                  )}
                </Cell>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
