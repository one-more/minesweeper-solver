import {takeEvery, put} from "redux-saga/effects"
import {apiActions, CellStatusPayload, OpenByCoordsPayload, StartSessionPayload} from "./reducer";
import {Action} from "redux-actions";
import {nextStep} from "~/modules/solver";
import {createMatrix, Matrix} from "~/modules/matrix";

/**
 help      - returns valid commands
 new L     - starts new session, L=1|2|3|4
 map       - returns the current map
 open X Y  - opens cell at X,Y coordinates
 **/

/**
 * passwords:
 * L1 - ThisWasEasy
 * L2 - NotSoMuch
 */

const url = 'wss://hometask.eg1236.com/game1/'
const webSocket = new WebSocket(url);

const socketReady = new Promise(resolve => {
    webSocket.onopen = resolve
})
const sendMessage = (command: string) => new Promise(resolve => {
    webSocket.send(command)
    webSocket.onmessage = msg => {
        console.log(`command: ${command}, msg: ${msg.data}`)
        resolve(msg.data)
    }
})

const storage = new Map<'matrix' | 'status' | 'level', Matrix | CellStatusPayload | number>()

export function* getMap() {
    const mapResp = yield socketReady.then(() => sendMessage('map'))
        .then((mapResp: string) => {
            return mapResp.replace('map:', '').trim()
        })
    storage.set('matrix', createMatrix(mapResp as string))
    yield put(
        apiActions.mapResponse(mapResp as string)
    )
}

export function* startSession(action: Action<StartSessionPayload>): Generator {
    const {payload: {level}} = action
    yield socketReady.then(() => sendMessage(`new ${level}`))
    yield* getMap()
    storage.set('status', 'OK')
    storage.set('level', level)
}

export function* openByCoords(action: Action<OpenByCoordsPayload>): Generator {
    const {payload: {x, y}} = action

    const resp = yield socketReady.then(() => sendMessage(`open ${x} ${y}`))

    const status = getStatusFromOpenResponse(resp as string)
    yield put(
        apiActions.openByCoordsResponse(
            x,
            y,
            status,
            (resp as string).replace('open:', '').trim()
        )
    )
    storage.set('status', status)

    yield* getMap()
}

function getStatusFromOpenResponse(response: string): CellStatusPayload {
    const normalizedResp = response.replace('open:', '').trim().toUpperCase()
    if (normalizedResp === 'OK') {
        return 'OK'
    }
    if (normalizedResp.includes('LOSE')) {
        return 'LOOSE'
    }
    return 'WIN'
}

export function* nextStepSaga(): Generator {
    const matrix = storage.get('matrix') as Matrix
    const {x, y} = nextStep(
        matrix,
        matrix.length,
    )
    yield* openByCoords(apiActions.openByCoords(x, y))
}

export function* tryToSolve(): Generator {
    let retries = 100
    while (retries > 0) {
        yield* nextStepSaga()

        if (storage.get('status') === 'WIN') {
            retries = 0
        }
        if (storage.get('status') === 'LOOSE') {
            retries--
            yield* startSession(apiActions.startSession(storage.get('level') as number))
        }
    }
}

export function* apiSaga() {
    yield takeEvery(apiActions.startSession.toString(), startSession)
    yield takeEvery(apiActions.openByCoords.toString(), openByCoords)
    yield takeEvery(apiActions.nextStep.toString(), nextStepSaga)
    yield takeEvery(apiActions.tryToSolve.toString(), tryToSolve)
}
