import {Action, createActions} from "redux-actions";


export type CellStatusPayload = 'OK' | 'LOOSE'
export type StartSessionPayload = {level: number}
export type MapResponsePayload = {map: string}
export type OpenByCoordsPayload = {x: number, y: number, status?: CellStatusPayload}
export type ApiActions = {
    startSession: (level: number) => Action<StartSessionPayload>,
    mapResponse: (map: string) => Action<MapResponsePayload>
    openByCoords: (x: number, y: number) => Action<OpenByCoordsPayload>
    openByCoordsResponse: (x: number, y: number, status: CellStatusPayload) => Action<OpenByCoordsPayload>
}
export const apiActions = createActions({
    START_SESSION: (level: number) => ({level}),
    MAP_RESPONSE: (map: string) => ({map}),
    OPEN_BY_COORDS: (x: number, y: number) => ({x, y}),
    OPEN_BY_COORDS_RESPONSE: (x: number, y: number, status: CellStatusPayload) => ({x, y, status}),
}) as ApiActions
