export const BOARD_SIZE = 10;
export const SHIP_TYPES = [
  "carrier",
  "battleship",
  "cruiser",
  "submarine",
  "destroyer",
];
export const SHIP_SIZES = new Map([
  ["carrier", 5],
  ["battleship", 4],
  ["cruiser", 3],
  ["submarine", 3],
  ["destroyer", 2],
]);

export function COLUMNS(cols: number): readonly number[] {
  return Object.freeze(new Array(cols).fill(0).map((_, i) => i + 1));
}

export function ROWS(rows: number): readonly string[] {
  return Object.freeze(
    new Array(rows)
      .fill(0)
      .map((_, i) => String.fromCharCode("A".charCodeAt(0) + i))
  );
}

export function getColumn(col: number): string {
  return (col + 1).toString();
}

export function getRow(row: number): string {
  return String.fromCharCode("A".charCodeAt(0) + row);
}

export function getCoords(cell: string): [number, number] {
  const [row, col] = cell.split("-");
  return [row.charCodeAt(0) - "A".charCodeAt(0), parseInt(col) - 1];
}
