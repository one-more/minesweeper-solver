import {Action, handleActions} from "redux-actions";
import {apiActions, MapResponsePayload, OpenByCoordsPayload} from "~/modules/api";

export enum CellStatus {
    CLOSED = 0,
    OK = 1,
    LOOSE = 2
}
export type MapModuleState = {
    grid: CellStatus[][]
}
export type WithMapModuleState = {
    map: MapModuleState
}
export const defaultMapModuleState: MapModuleState = {
    grid: []
}

export const mapModuleReducer = handleActions<MapModuleState, MapResponsePayload | OpenByCoordsPayload>({
    [apiActions.mapResponse.toString()]: (state, {payload}: Action<MapResponsePayload>) => ({
        ...state,
        grid: payload.map.split('\n').map(line => line.split('').map(() => CellStatus.CLOSED)),
    }),
    [apiActions.openByCoordsResponse.toString()]: (state, {payload: {x, y, status}}: Action<OpenByCoordsPayload>) => ({
        ...state,
        grid: state.grid.map((row, rowIndex) => row.map((cellStatus, cellIndex) => {
            if (rowIndex == x && cellIndex == y) {
                return status === 'OK' ? CellStatus.OK : CellStatus.LOOSE
            }
            return cellStatus
        }))
    }),
}, defaultMapModuleState)
