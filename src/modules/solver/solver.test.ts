import {
    getClosedNeighbours,
    getNeighbours, nextStep,
    setBombProbability,
    setLocalBombProbability
} from "./index";
import {createMatrix, Matrix} from "~/modules/matrix";

describe("solver functions", () => {
    function getGlobalProbability(matrix: Matrix, presumedBombsCount: number): number {
        return presumedBombsCount / matrix.reduce(
            (acc, row) => acc + row.filter(cell => getNeighbours(matrix, cell.x, cell.y).every(n => n.hint === -1)).length,
            0
        )
    }

    it("returns neighbours", () => {
        const matrix = createMatrix(`
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
        `)
        expect(getNeighbours(matrix, 0, 0)).toStrictEqual([
            matrix[0][1],
            matrix[1][0],
            matrix[1][1],
        ])
        expect(getNeighbours(matrix, 9, 0)).toStrictEqual([
            matrix[0][8],
            matrix[1][8],
            matrix[1][9],
        ])
        expect(getNeighbours(matrix, 0, 9)).toStrictEqual([
            matrix[8][0],
            matrix[8][1],
            matrix[9][1],
        ])
        expect(getNeighbours(matrix, 9, 9)).toStrictEqual([
            matrix[8][8],
            matrix[8][9],
            matrix[9][8],
        ])
        expect(getNeighbours(matrix, 5, 5)).toStrictEqual([
            matrix[4][4],
            matrix[4][5],
            matrix[4][6],
            matrix[5][4],
            matrix[5][6],
            matrix[6][4],
            matrix[6][5],
            matrix[6][6],
        ])
    })

    it("returns closed neighbours", () => {
        expect(
            getClosedNeighbours(
                getNeighbours(
                    createMatrix(
                        `
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                            □□□□□□□□□□
                        `
                    ),
                    5,
                    5,
                )
            )
        ).toHaveLength(8)

        expect(
            getClosedNeighbours(
                getNeighbours(
                    createMatrix(`
                        □□□□□□□□□□
                        □□□□□□□□□□
                        □□□□□□□□□□
                        □□□□□□□□□□
                        □□□□2□□□□□
                        □□□11□□□□□
                        □□□□□□□□□□
                        □□□□□□□□□□
                        □□□□□□□□□□
                        □□□□□□□□□□
                    `),
                    4,
                    4,
                )
            )
        ).toHaveLength(6)
    })

    it("sets local probability around one cell", () => {
        const matrix = createMatrix(`
            □□□
            □1□
            □□□
        `)
        expect(setLocalBombProbability(matrix)).toStrictEqual(
            matrix.map((row, y) => row.map((cell, x) => {
                if (y === 1 && x === 1) {
                    return cell
                }
                return {
                    ...cell,
                    bombProbability: 1 - (1 / 8)
                }
            }))
        )
    })

    it("sets local probability around two cells", () => {
        const matrix = createMatrix(`
            □□□□
            □11□
            □□□□
        `)
        expect(setLocalBombProbability(matrix)).toStrictEqual(
            matrix.map((row, y) => row.map((cell, x) => {
                if ((y === 1 && x === 1) || (y === 1 && x === 2)) {
                    return cell
                }
                if ((y === 0 && x === 1) || (y === 0 && x === 2) || (y === 2 && x === 1) || (y === 2 && x === 2)) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 7) * (1 / 7))
                    }
                }
                return {
                    ...cell,
                    bombProbability: 1 - (1 / 7)
                }
            }))
        )
    })

    it("recalculates local probability when finds a bomb", () => {
        const matrix = createMatrix(`
            □□□□□□
            □□1□□□
            11122□
            0001□□
            00012□
            00001□
        `)

        expect(setLocalBombProbability(matrix)).toStrictEqual(
            matrix.map((row, y) => row.map((cell, x) => {
                if (y === 3 && x === 4) {
                    return {
                        ...cell,
                        isBomb: true,
                        bombProbability: 1,
                    }
                }
                if (
                    (y === 0 && x === 1) ||
                    (y === 0 && x === 2) ||
                    (y === 0 && x === 3) ||
                    (y === 1 && x === 5) ||
                    (y === 2 && x === 5)
                ) {
                    return {
                        ...cell,
                        bombProbability: 0.8,
                    }
                }
                if (y === 1 && x === 1) {
                    return {
                        ...cell,
                        bombProbability: 0.975,
                    }
                }
                if (y === 1 && x === 3) {
                    return {
                        ...cell,
                        bombProbability: 0.99,
                    }
                }
                if (y === 1 && x === 4) {
                    return {
                        ...cell,
                        bombProbability: 0.9,
                    }
                }
                if (y === 3 && x === 5) {
                    return {
                        ...cell,
                        bombProbability: 0.9333333333333333,
                    }
                }
                if ((y === 4 && x === 5) || (y === 5 && x === 5)) {
                    return {
                        ...cell,
                        bombProbability: 0.8333333333333334,
                    }
                }
                if (
                    (y === 1 && x === 1) ||
                    (y === 1 && x === 4) ||
                    (y === 1 && x === 5) ||
                    (y === 3 && x === 5)
                ) {
                    return {
                        ...cell,
                        bombProbability: 0,
                    }
                }
                if (
                    (y === 3 && x === 3) ||
                    (y === 4 && x === 3)
                ) {
                    return {
                        ...cell,
                        hint: 0,
                    }
                }
                if ((y === 4 && x === 4) || (y === 2 && x === 3) || (y === 2 && x === 4)) {
                    return {
                        ...cell,
                        hint: 1
                    }
                }
                if ((y === 4 && x === 5) || (y === 5 && x === 5) || (y === 1 && x === 0)) {
                    return {
                        ...cell,
                        bombProbability: 0.75
                    }
                }
                return cell
            }))
        )
    })

    it("sets local and global probability", () => {
        const matrix = createMatrix(`
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□111
            □□□□□□□100
            □□□□□□□100
        `)
        expect(setBombProbability(matrix, 10)).toStrictEqual(
            matrix.map((row, y) => row.map((cell, x) => {
                if (cell.hint !== -1) {
                    return cell
                }
                if (y === 6 && x === 6) {
                    return {
                        ...cell,
                        bombProbability: 1 - (1 / 5)
                    }
                }
                if (y === 6 && x === 7) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 5) * (1 / 3))
                    }
                }
                if (y === 6 && x === 8) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 5) * (1 / 3) * (1 / 2))
                    }
                }
                if (y === 6 && x === 9) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 2) * (1 / 3))
                    }
                }
                if (y === 7 && x === 6) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 5) * (1 / 3))
                    }
                }
                if (y === 8 && x === 6) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 5) * (1 / 3) * (1 / 2))
                    }
                }
                if (y === 9 && x === 6) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 3) * (1 / 2))
                    }
                }
                return {
                    ...cell,
                    bombProbability: 10 / 84
                }
            }))
        )
    })

    it("sets local and global probability case 2", () => {
        const matrix = createMatrix(`
            □□□□□□□□□2
            □□□□□□□□□□
            □□□□□□□□□□
            □□□□□□□□21
            □□□□□□□□10
            □□□□□□2110
            □□□□□□1000
            □□□□□11000
            □□□□110011
            □□□1□1001□
        `)
        expect(setBombProbability(matrix, 10)).toStrictEqual(
            matrix.map((row, y) => row.map((cell, x) => {
                if ((y === 0 && x === 8) || (y === 1 && x === 8) || (y === 1 && x === 9)) {
                    return {
                        ...cell,
                        bombProbability: 1 - (2 / 3)
                    }
                }
                if ((y === 2 && x === 7)) {
                    return {
                        ...cell,
                        bombProbability: 1 - (1 / 4)
                    }
                }
                if ((y === 2 && x === 8) || (y === 2 && x === 9)) {
                    return {
                        ...cell,
                        bombProbability: 1 - ((1 / 4) * (1 / 2))
                    }
                }
                if (
                    (y === 3 && x === 7) ||
                    (y === 4 && x === 5) ||
                    (y === 4 && x === 6) ||
                    (y === 5 && x === 5) ||
                    (y === 6 && x === 4) ||
                    (y === 7 && x === 3) ||
                    (y === 7 && x === 4) ||
                    (y === 8 && x === 2) ||
                    (y === 8 && x === 3) ||
                    (y === 9 && x === 2)
                ) {
                    return {
                        ...cell,
                        bombProbability: 0
                    }
                }
                if (y === 3 && x === 8) {
                    return {
                        ...cell,
                        hint: 1,
                    }
                }
                if ((y === 4 && x === 7) || (y === 6 && x === 5) || (y === 9 && x === 4) || (y === 9 && x === 9)) {
                    return {
                        ...cell,
                        isBomb: true,
                        bombProbability: 1,
                    }
                }
                if (
                    (y === 4 && x === 8) ||
                    (y === 5 && x === 6) ||
                    (y === 5 && x === 7) ||
                    (y === 5 && x === 8) ||
                    (y === 6 && x === 6) ||
                    (y === 7 && x === 5) ||
                    (y === 7 && x === 6) ||
                    (y === 8 && x === 4) ||
                    (y === 8 && x === 5) ||
                    (y === 8 && x === 8) ||
                    (y === 8 && x === 9) ||
                    (y === 9 && x === 3) ||
                    (y === 9 && x === 5) ||
                    (y === 9 && x === 8)
                ) {
                    return {
                        ...cell,
                        hint: 0,
                    }
                }
                if (cell.hint !== -1) {
                    return cell
                }
                return {
                    ...cell,
                    bombProbability: 10 / 51
                }
            }))
        )
    })

    it("does not return next step", () => {
        const matrix = createMatrix(`
            *11*210000
            1223*10111
            01*21101*1
            0111000111
            1121100000
            1*2*100111
            11211002*2
            01222112*2
            01**3*2222
            0123*3*11*
        `)

        expect(nextStep(matrix, 10)).toStrictEqual(undefined)
    })
})
