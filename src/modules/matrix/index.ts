export type HintValue = -1 | 0 | 1 | 2 | 3

export enum CellStatus {
    CLOSED = 0,
    OK = 100,
    LOOSE = 101
}

export type Cell = {
    x: number;
    y: number;
    hint: HintValue;
    bombProbability: number
    status: CellStatus
    isBomb: boolean
}

export type Matrix = Cell[][]

export function createMatrix(schema: string): Matrix {
    return schema.trim().split('\n').map(
        (line, y) => line.trim().split('')
            .map((symbol, x) => ({
                x,
                y,
                hint: (isNaN(Number(symbol)) ? -1 : Number(symbol)) as HintValue,
                bombProbability: getBombProbability(symbol),
                status: getCellStatus(symbol),
                isBomb: isBomb(symbol),
            }))
    )
}

function isBomb(content: string) {
    return content.trim() === '*'
}

function getBombProbability(content: string): number {
    if (content.trim() === '*') {
        return 1
    }
    return NaN
}

function getCellStatus(content: string): CellStatus {
    if (content.trim() === '*') {
        return CellStatus.LOOSE
    }
    return isNaN(Number(content)) ? CellStatus.CLOSED : CellStatus.OK
}
