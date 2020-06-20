import {Cell, HintValue, Matrix} from "~/modules/matrix";

export function getNeighbours(matrix: Matrix, x: number, y: number): Cell[] {
    const neighbours = []
    if ((matrix[y-1] || [])[x-1]) {
        neighbours.push(matrix[y-1][x-1])
    }
    if ((matrix[y-1] || [])[x]) {
        neighbours.push(matrix[y-1][x])
    }
    if ((matrix[y-1] || [])[x+1]) {
        neighbours.push(matrix[y-1][x+1])
    }
    if (matrix[y][x-1]) {
        neighbours.push(matrix[y][x-1])
    }
    if (matrix[y][x+1]) {
        neighbours.push(matrix[y][x+1])
    }
    if ((matrix[y+1] || [])[x-1]) {
        neighbours.push(matrix[y+1][x-1])
    }
    if ((matrix[y+1] || [])[x]) {
        neighbours.push(matrix[y+1][x])
    }
    if ((matrix[y+1] || [])[x+1]) {
        neighbours.push(matrix[y+1][x+1])
    }
    return neighbours
}

export function getClosedNeighbours(neighbours: Cell[]): Cell[] {
    return neighbours.filter(cell => cell.hint === -1 && !cell.isBomb && cell.bombProbability !== 0)
}

export function getOpenNeighbours(neighbours: Cell[]): Cell[] {
    return neighbours.filter(cell => cell.hint !== -1)
}

export function cloneMatrix(matrix: Matrix): Matrix {
    return matrix.map(
        row => row.map(cell => ({
            ...cell,
        }))
    )
}

export function setLocalBombProbability(matrix: Matrix): Matrix {
    const matrixClone = cloneMatrix(matrix)
    let bombFound = false
    matrixClone.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell.hint !== -1) {
                const closedNeighbours = getClosedNeighbours(
                    getNeighbours(matrixClone, x, y)
                )
                closedNeighbours.forEach(
                    neighbour => {
                        if (neighbour.bombProbability !== 1) {
                            const addProbability = (cell.hint / closedNeighbours.length)
                            neighbour.bombProbability = addProbability === 1 ?
                                1 : ((isNaN(neighbour.bombProbability) ? 1 : neighbour.bombProbability) * addProbability)
                        }
                    }
                )
            }
        })
    })
    matrixClone.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell.hint === -1 && cell.bombProbability !== 0 && cell.bombProbability !== 1) {
                cell.bombProbability = 1 - cell.bombProbability
            }
            if (isProbablyBomb(cell)) {
                bombFound = true
            }
        })
    })
    if (bombFound) {
        matrixClone.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (isProbablyBomb(cell)) {
                    cell.isBomb = true
                    const neighbours = getOpenNeighbours(
                        getNeighbours(matrixClone, cell.x, cell.y)
                    )
                    neighbours.forEach(neighbour => neighbour.hint = Math.max(0, neighbour.hint - 1) as HintValue)
                }
            })
        })
        return setLocalBombProbability(
            matrixClone.map(
                row => row.map(cell => {
                    if (cell.hint === -1 && !cell.isBomb) {
                        return {
                            ...cell,
                            bombProbability: NaN,
                        }
                    }
                    return cell
                })
            )
        )
    }
    return matrixClone
}

export function isProbablyBomb(cell: Cell): boolean {
    return cell.bombProbability >= 0.999 && cell.isBomb === false
}

export function setBombProbability(matrix: Matrix, presumedBombsCount: number): Matrix {
    const withLocalProbability = setLocalBombProbability(matrix)
    const closedCellsCount = withLocalProbability.reduce(
        (acc, row) => {
            return acc + row.reduce((acc, cell) => acc + ((cell.hint === -1 && isNaN(cell.bombProbability)) ? 1 : 0), 0)
        }, 0
    )
    withLocalProbability.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell.hint === -1 && isNaN(cell.bombProbability)) {
                cell.bombProbability = presumedBombsCount / closedCellsCount
            }
        })
    })
    return withLocalProbability
}

export function getCellsToClick(matrix: Matrix): Cell[] {
    const lowestProbability = matrix.reduce(
        (acc, row) => row.reduce(
            (acc, cell) => (cell.bombProbability < acc && !isNaN(cell.bombProbability) && !cell.isBomb) ?
                cell.bombProbability : acc, acc,
        ), Infinity
    )
    return matrix.reduce(
        (acc, row) => acc.concat(
            row.filter(cell => cell.bombProbability === lowestProbability)
        ), []
    )
}

export function nextStep(matrix: Matrix, presumedBombsCount: number): Cell {
    const cellsToClick = getCellsToClick(
        setBombProbability(
            matrix,
            presumedBombsCount,
        )
    )
    return cellsToClick[getRandomIntInclusive(0, cellsToClick.length - 1)]
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


