import {Action, handleActions} from "redux-actions";
import {apiActions, OpenByCoordsPayload} from "~/modules/api";

export enum GameStatus {
    ACTIVE = 1,
    LOST = 2,
}
export type GameModuleState = {
    status: GameStatus;
    level: 1 | 2 | 3 | 4
}
export type WithGameModuleState = {
    game: GameModuleState
}

export const defaultGameModuleState: GameModuleState = {
    status: GameStatus.ACTIVE,
    level: 1
}

export const gameModuleReducer = handleActions({
    [apiActions.openByCoordsResponse.toString()]: (state, {payload: {status}}: Action<OpenByCoordsPayload>) => ({
        ...state,
        status: status === 'LOOSE' ? GameStatus.LOST : state.status
    }),
    [apiActions.mapResponse.toString()]: state => ({
        ...state,
        status: GameStatus.ACTIVE,
    })
}, defaultGameModuleState)
