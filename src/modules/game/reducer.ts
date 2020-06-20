import {Action, handleActions} from "redux-actions";
import {apiActions, CellStatusPayload, OpenByCoordsPayload, StartSessionPayload} from "~/modules/api";

export enum GameStatus {
    ACTIVE = 1,
    LOST = 2,
    WIN = 3
}
export type GameModuleState = {
    status: GameStatus;
    level: number
    openActionResponse: string
}
export type WithGameModuleState = {
    game: GameModuleState
}

export const defaultGameModuleState: GameModuleState = {
    status: GameStatus.ACTIVE,
    level: 1,
    openActionResponse: ''
}

export const gameModuleReducer = handleActions<GameModuleState, OpenByCoordsPayload | StartSessionPayload>({
    [apiActions.openByCoordsResponse.toString()]: (state, {payload: {status, rawResponse}}: Action<OpenByCoordsPayload>) => ({
        ...state,
        status: getGameStatusFromActionPayload(status),
        openActionResponse: rawResponse,
    }),
    [apiActions.startSession.toString()]: (state, {payload}: Action<StartSessionPayload>) => ({
        ...state,
        status: GameStatus.ACTIVE,
        level: payload.level,
    })
}, defaultGameModuleState)

function getGameStatusFromActionPayload(status: CellStatusPayload): GameStatus {
    if (status === 'LOOSE') {
        return GameStatus.LOST
    }
    if (status === 'WIN') {
        return GameStatus.WIN
    }
    return GameStatus.ACTIVE
}
