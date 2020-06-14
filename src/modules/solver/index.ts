export type HintValue = -1 | 0 | 1 | 2 | 3

export type Cell = {
    x: number;
    y: number;
    hint: HintValue;
    bombProbability: number
}

export type Matrix = Cell[][]

export function addNeighbourIfClosed(matrix: Matrix, x: number, y: number, cells: Cell[]): Cell[] {
    if (matrix[y] && matrix[y][x] && matrix[y][x].hint === -1) {
        return cells.concat(matrix[y][x])
    }
    return cells
}

export function getClosedNeighbours(matrix: Matrix, x: number, y: number): Cell[] {
    return addNeighbourIfClosed(
        matrix,
        x - 1,
        y - 1,
        addNeighbourIfClosed(
            matrix,
            x,
            y - 1,
            addNeighbourIfClosed(
                matrix,
                x + 1,
                y - 1,
                addNeighbourIfClosed(
                    matrix,
                    x - 1,
                    y,
                    addNeighbourIfClosed(
                        matrix,
                        x + 1,
                        y,
                        addNeighbourIfClosed(
                            matrix,
                            x - 1,
                            y + 1,
                            addNeighbourIfClosed(
                                matrix,
                                x,
                                y + 1,
                                addNeighbourIfClosed(
                                    matrix,
                                    x + 1,
                                    y + 1,
                                    []
                                )
                            )
                        )
                    )
                )
            )
        )
    )
}

export function nextStep(matrix: Matrix, presumedBombsCount: number): Cell {
    const closedCellsCount = matrix.reduce(
        (acc, row) =>
            row.reduce((acc, cur) => cur.hint === -1 ? acc : acc + 1, acc)
        ,
        0
    )
    const hasOpenCells = !matrix.every(
        row => row.every(cell => cell.hint === -1)
    )
    if (!hasOpenCells) {
        const y = Math.floor(matrix.length / 2)
        const x = Math.floor(matrix[y].length / 2)
        return matrix[y][x]
    }

    matrix.forEach((row, y) => row.forEach((cell, x) => {
        if (cell.hint === -1) {
            cell.bombProbability += presumedBombsCount / (closedCellsCount)
        } else {
            const neighbours = getClosedNeighbours(matrix, x, y)
            neighbours.forEach(el => {
                el.bombProbability += cell.hint / neighbours.length
            })
        }
    }))
    console.log(matrix)
    return matrix.reduce((acc, row) => {
        return row.reduce((acc, cur) => {
            return (cur.bombProbability < acc.bombProbability && cur.hint === -1) ? cur : acc
        }, acc)
    }, {x: -1, y: -1, hint: -1, bombProbability: Infinity})
}


