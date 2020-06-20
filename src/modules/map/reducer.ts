import {Action, handleActions} from "redux-actions";
import {apiActions, MapResponsePayload, OpenByCoordsPayload} from "~/modules/api";
import {createMatrix, Matrix} from "~/modules/matrix";

export type MapModuleState = {
    matrix: Matrix,
}
export type WithMapModuleState = {
    map: MapModuleState
}
export const defaultMapModuleState: MapModuleState = {
    matrix: []
}

export const mapModuleReducer = handleActions<MapModuleState, MapResponsePayload | OpenByCoordsPayload>({
    [apiActions.mapResponse.toString()]: (state, {payload}: Action<MapResponsePayload>) => ({
        ...state,
        matrix: createMatrix(payload.map)
    }),
}, defaultMapModuleState)
