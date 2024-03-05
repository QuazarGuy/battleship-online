export function COLUMNS(cols: number): readonly number[] {
    return Object.freeze(new Array(cols).fill(0).map((_, i) => i + 1));
}

export function ROWS(rows: number): readonly string[] {
    return Object.freeze(new Array(rows).fill(0).map((_, i) => String.fromCharCode("A".charCodeAt(0) + i)));
}

export function getColumn(col: number): string {
    return (col + 1).toString();
}

export function getRow(row: number): string {
    return String.fromCharCode("A".charCodeAt(0) + row);
}