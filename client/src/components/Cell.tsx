interface Props {
  children: React.ReactNode;
  cellid: string;
  state: string;
  hover: boolean;
  hoverColor: string;
  boardWidth: number;
  colCount: number;
  onMove?: () => void;
  onHover?: () => void;
}

const COLORS = Object.freeze(
  new Map([
    ["hit", "red"],
    ["miss", "white"],
    ["empty", "skyblue"],
    ["ship", "grey"],
  ])
);

export function Cell({
  cellid,
  state,
  hover,
  hoverColor,
  boardWidth,
  colCount,
  children,
  onMove = () => {},
  onHover = () => {},
}: Props) {
  return (
    <div
      id={cellid}
      className="cell"
      style={{
        border: hover ? "thin solid " + hoverColor : "thin solid grey",
        backgroundColor:
          state !== ""
            ? COLORS.has(state)
              ? COLORS.get(state)
              : COLORS.get("ship")
            : COLORS.get("empty"),
        width: boardWidth / colCount,
        height: boardWidth / colCount,
      }}
      onMouseUp={onMove}
      onTouchEnd={onMove}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
    >
      {children}
    </div>
  );
}
