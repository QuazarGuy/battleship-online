type NotationProps = {
  boardWidth: number;
  customNotationStyle?: Record<string, string | number>;
  row: string;
  col: string;
};

export function Notation({
  row,
  col,
  boardWidth,
  customNotationStyle,
}: NotationProps) {
  const isRow = col === "1";
  const isColumn = row === "A";
  const isTopLeftSquare = isRow && isColumn;
  boardWidth = boardWidth / 2;

  function renderTopLeft() {
    return (
      <>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: "grey" },
            ...alphaStyle(boardWidth, customNotationStyle),
          }}
        >
          {row}
        </div>
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            ...{ color: "grey" },
            ...numericStyle(boardWidth, {
              paddingLeft: boardWidth / 14 - boardWidth / 48,
            }),
          }}
        >
          {col}
        </div>
      </>
    );
  }

  function renderNumbers() {
    return (
      <div
        style={{
          userSelect: "none",
          zIndex: 3,
          position: "absolute",
          ...{ color: "grey" },
          ...numericStyle(boardWidth, customNotationStyle),
        }}
      >
        {col}
      </div>
    );
  }

  function renderLetters() {
    return (
      <div
        style={{
          userSelect: "none",
          zIndex: 3,
          position: "absolute",
          ...{ color: "grey" },
          ...alphaStyle(boardWidth, customNotationStyle),
        }}
      >
        {row}
      </div>
    );
  }

  if (isTopLeftSquare) {
    return renderTopLeft();
  }

  if (isColumn) {
    return renderNumbers();
  }

  if (isRow) {
    return renderLetters();
  }

  return null;
}

const numericStyle = (
  width: number,
  customNotationStyle?: Record<string, string | number>
) => ({
  alignSelf: "center",
  // paddingLeft: width / 32 - width / 48,
  // paddingRight: width / 32 - width / 48,
  fontSize: width / 16,
  ...customNotationStyle,
});

const alphaStyle = (
  width: number,
  customNotationStyle?: Record<string, string | number>
) => ({
  alignSelf: "flex-start",
  paddingLeft: width / 32 - width / 48,
  fontSize: width / 16,
  ...customNotationStyle,
});
