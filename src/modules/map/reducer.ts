import {Action, handleActions} from "redux-actions";
import {apiActions, MapResponsePayload, OpenByCoordsPayload} from "~/modules/api";

export enum CellStatus {
    CLOSED = 0,
    OK = 100,
    LOOSE = 101
}
export type MapModuleState = {
    grid: CellStatus[][],
    hints: (number | string)[][]
}
export type WithMapModuleState = {
    map: MapModuleState
}
export const defaultMapModuleState: MapModuleState = {
    grid: [],
    hints: [],
}

export const mapModuleReducer = handleActions<MapModuleState, MapResponsePayload | OpenByCoordsPayload>({
    [apiActions.mapResponse.toString()]: (state, {payload}: Action<MapResponsePayload>) => ({
        ...state,
        grid: payload.map.split('\n').map(
            (line, rowIndex) => line.split('')
                .map((_, cellIndex) => (state.grid[rowIndex] || [])[cellIndex])
        ),
        hints: payload.map.split('\n').map(line => line.split('').map(str => isNaN(Number(str)) ? '' : Number(str))),
    }),
    [apiActions.openByCoordsResponse.toString()]: (state, {payload: {x, y, status}}: Action<OpenByCoordsPayload>) => ({
        ...state,
        grid: state.grid.map((row, rowIndex) => row.map((cellStatus, cellIndex) => {
            if (cellIndex == x && rowIndex == y) {
                return status === 'OK' ? CellStatus.OK : CellStatus.LOOSE
            }
            return cellStatus
        }))
    }),
    [apiActions.startSession.toString()]: (state) => ({
        ...state,
        grid: []
    }),
}, defaultMapModuleState)
