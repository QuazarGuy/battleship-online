import { Cell } from "./Cell";
import { Notation } from "./Notation";
import { getRow, getColumn } from "../utils/consts";

interface Props {
  id: string;
  boardState: string[][];
  boardWidth: number;
  rows: number;
  cols: number;
  onMove: (cellid: string) => boolean;
}

export function Board({
  id,
  boardState,
  boardWidth,
  rows = 9,
  cols = 9,
  onMove,
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
                  boardWidth={boardWidth}
                  colCount={cols}
                  onMove={() => onMove(`${row}-${col}`)}
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
