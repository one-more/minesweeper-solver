import {MapModuleState, WithMapModuleState} from "./reducer";
import { createSelector } from 'reselect';

export const mapModuleStateSelector = (state: WithMapModuleState): MapModuleState => state.map
export const gameMapStateSelector = createSelector(
    mapModuleStateSelector,
    state => ({
        grid: state.grid
    })
)
