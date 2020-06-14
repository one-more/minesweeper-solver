import {takeEvery, put} from "redux-saga/effects"
import {apiActions, OpenByCoordsPayload, StartSessionPayload} from "./reducer";
import {Action} from "redux-actions";
import {HintValue, Matrix, nextStep} from "~/modules/solver";

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
    webSocket.onmessage = msg => {
        console.log(`command: ${command}, msg: ${msg.data}`)
        resolve(msg.data)
    }
})

const storage = new Map<'matrix', Matrix>()

function createMatrix(schema: string): Matrix {
    return schema.split('\n').map(
        (line, y) => line.split('')
            .map((symbol, x) => ({
                x,
                y,
                hint: (isNaN(Number(symbol)) ? -1 : Number(symbol)) as HintValue,
                bombProbability: 0,
            }))
    )
}

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
}

export function* openByCoords(action: Action<OpenByCoordsPayload>): Generator {
    const {payload: {x, y}} = action

    const resp = yield socketReady.then(() => sendMessage(`open ${x} ${y}`))
    const normalizedResp = (resp as string).replace('open:', '').trim()
    const status = normalizedResp === 'OK' ? 'OK' : 'LOOSE'
    yield put(
        apiActions.openByCoordsResponse(
            x,
            y,
            status,
        )
    )

    if (status === 'OK') {
        yield* getMap()
    }
}

export function* nextStepSaga(): Generator {
    const matrix = storage.get('matrix')
    const {x, y} = nextStep(
        matrix,
        matrix.length ** 2,
    )
    yield* openByCoords(apiActions.openByCoords(x, y))
}

export function* apiSaga() {
    yield takeEvery(apiActions.startSession.toString(), startSession)
    yield takeEvery(apiActions.openByCoords.toString(), openByCoords)
    yield takeEvery(apiActions.nextStep.toString(), nextStepSaga)
}
