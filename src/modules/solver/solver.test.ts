import {addNeighbourIfClosed, Cell, getClosedNeighbours, HintValue, nextStep} from "./index";

describe("solver functions", () => {
    function createMatrix(map: number[][]): Cell[][] {
        return map.map(
            (row, y) =>
                row.map((hint, x) => ({x, y, hint: hint as HintValue , bombProbability: 0}))
        )
    }

    const matrix: Cell[][] = createMatrix(
        [
            [-1, 1, 2, -1],
            [3, 2, -1, 1],
            [2, -1, 3, 2],
            [1, 1, -1, 3],
        ]
    )

    it("adds empty neighbour", () => {
        expect(
            addNeighbourIfClosed(
                matrix,
                0,
                0,
                []
            )
        ).toStrictEqual([matrix[0][0]])
        expect(
            addNeighbourIfClosed(
                matrix,
                3,
                0,
                []
            )
        ).toStrictEqual([matrix[0][3]])
        expect(
            addNeighbourIfClosed(
                matrix,
                2,
                3,
                []
            )
        ).toStrictEqual([matrix[3][2]])
        expect(
            addNeighbourIfClosed(
                matrix,
                2,
                1,
                []
            )
        ).toStrictEqual([matrix[1][2]])
    })

    it("ignores non empty neighbour", () => {
        expect(
            addNeighbourIfClosed(
                matrix,
                1,
                0,
                []
            )
        ).toStrictEqual([])
    })

    it("returns empty neighbours", () => {
        expect(
            getClosedNeighbours(
                matrix,
                1,
                0,
            )
        ).toStrictEqual([
            matrix[1][2],
            matrix[0][0],
        ])

        expect(
            getClosedNeighbours(
                matrix,
                2,
                2,
            )
        ).toStrictEqual([
            matrix[3][2],
            matrix[2][1],
            matrix[1][2],
        ])
    })

    it("returns next step", () => {
        expect(
            nextStep(
                createMatrix([
                    [-1, 1, -1, -1],
                    [1, 1, -1, -1],
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                ]),
                5
            )
        ).toStrictEqual({
            x: 3,
            y: 0,
            hint: -1,
            bombProbability: 5 / 16
        })

        expect(
            nextStep(
                createMatrix([
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                    [-1, -1, -1, -1],
                ]),
                5
            )
        ).toStrictEqual({
            x: 2,
            y: 2,
            hint: -1,
            bombProbability: 0
        })
    })
})
