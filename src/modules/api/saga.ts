import {takeEvery, put} from "redux-saga/effects"
import {apiActions, CellStatusPayload, OpenByCoordsPayload, StartSessionPayload} from "./reducer";
import {Action} from "redux-actions";

/**
 help      - returns valid commands
 new L     - starts new session, L=1|2|3|4
 map       - returns the current map
 open X Y  - opens cell at X,Y coordinates
 **/

const url = 'wss://hometask.eg1236.com/game1/'
const webSocket = new WebSocket(url);

const socketReady = new Promise(resolve => {
    webSocket.onopen = resolve
})
const sendMessage = (command: string) => new Promise(resolve => {
    webSocket.send(command)
    webSocket.onmessage = msg => resolve(msg.data)
})

export function* startSession(action: Action<StartSessionPayload>): Generator {
    const {payload: {level}} = action
    const mapResp = yield socketReady.then(() => sendMessage(`new ${level}`)).then(() => sendMessage('map'))
        .then((mapResp: string) => {
            return mapResp.replace('map:', '').trim()
        })
    yield put(
        apiActions.mapResponse(mapResp as string)
    )
}

export function* openByCoords(action: Action<OpenByCoordsPayload>): Generator {
    const {payload: {x, y}} = action

    const resp = yield socketReady.then(() => sendMessage(`open ${x} ${y}`))
    const normalizedResp = (resp as string).replace('open:', '').trim()
    yield put(
        apiActions.openByCoordsResponse(
            x,
            y,
            normalizedResp === 'OK' ? 'OK' : 'LOOSE',
        )
    )
}

export function* apiSaga() {
    yield takeEvery(apiActions.startSession.toString(), startSession)
    yield takeEvery(apiActions.openByCoords.toString(), openByCoords)
}
