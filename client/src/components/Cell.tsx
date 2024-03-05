import { useContext, useState } from "react";
import { BoardContext } from "../context/board-context";

interface Props {
  children: React.ReactNode;
  cellid: string;
  state: string;
  ship: boolean;
  boardWidth: number;
  colCount: number;
}

const COLORS = Object.freeze(
  new Map([
    ["hit", "red"],
    ["miss", "white"],
    ["empty", "skyblue"],
    ["ship", "grey"],
  ])
);

export function Cell({ cellid, boardWidth, colCount, children }: Props) {
  const ship = useContext(BoardContext);
  const [state, setState] = useState(String);
  const [hover, setHover] = useState(false);

  function handleClick() {
    if (ship) {
      setState("hit");
    } else {
      setState("miss"); 
    }
  }

  return (
    <div
      id={cellid}
      className="cell"
      style={{
        border: hover ? "thin solid white" : "thin solid grey",
        backgroundColor: state !== "" ? COLORS.get(state) : COLORS.get("empty"),
        width: boardWidth / colCount,
        height: boardWidth / colCount,
      }}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
}
