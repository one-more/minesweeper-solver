import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import createSagaMiddleware from 'redux-saga';
import {apiSaga} from "~/modules/api";
import { all } from "redux-saga/effects";
import {mapModuleReducer, MapModuleState} from "~/modules/map";
import {gameModuleReducer, GameModuleState} from "~/modules/game";

export type AppState = {
    map: MapModuleState;
    game: GameModuleState
};

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

export const rootReducer = combineReducers({
    map: mapModuleReducer,
    game: gameModuleReducer,
});
export const store = createStore<AppState, Action, {}, {}>(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
);

export function* rootSaga(): Generator {
    yield all([
        apiSaga()
    ])
}
sagaMiddleware.run(rootSaga);
