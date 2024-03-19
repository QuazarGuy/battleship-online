import { useContext, useState } from "react";
import { BoardContext } from "../context/board-context";
import { socket } from "../socket";

interface Props {
  children: React.ReactNode;
  cellid: string;
  state: string;
  boardWidth: number;
  colCount: number;
  onMove?: () => void;
}

const COLORS = Object.freeze(
  new Map([
    ["hit", "red"],
    ["miss", "white"],
    ["empty", "skyblue"],
    ["ship", "grey"],
  ])
);

export function Cell({ cellid, state, boardWidth, colCount, children, onMove = () => {} }: Props) {
  // const ship = useContext(BoardContext);
  const [hover, setHover] = useState(false);

  // async function handleClick() {
  //   if (state !== "empty") {
  //     console.log("cell already clicked");
  //   } else {
  //     let status = "";
  //     try {
  //       socket.emit("move", cellid);
  //       status = await new Promise((resolve, reject) => {
  //         // Socket names are global, temporarily create a socket for this
  //         // cell. Moves can't be spammed for normal users if we check cellid.
  //         socket.once("move", (data) => {
  //           if (data.error) {
  //             reject(new Error(data.error));
  //           } else if (data.cellid !== cellid) {
  //             reject(
  //               new Error(
  //                 "data.cellid " + data.cellid + " !== cellid " + cellid
  //               )
  //             );
  //           }
  //           resolve(data.status);
  //         });
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       return;
  //     }
  //   }
  // }

  console.log("cell: ", cellid, " state: ", state);

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
      onClick={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
}
