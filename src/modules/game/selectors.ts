import {GameModuleState, WithGameModuleState} from "./reducer";

export const gameModuleStateSelector = (state: WithGameModuleState): GameModuleState => state.game
