import React, {ChangeEvent, PureComponent, ReactNode, SyntheticEvent} from "react";
import {GameModuleState, GameStatus} from "./reducer";
import {connect} from "react-redux";
import styled from "@emotion/styled";
import {gameModuleStateSelector} from "~/modules/game/selectors";
import {apiActions} from "~/modules/api";

export type GameContainerProps = GameModuleState & {
    children: ReactNode,
    startSession: (level: number) => void
    nextStep: () => void;
}
export class GameContainerComponent extends PureComponent<GameContainerProps> {
    onLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => this.props.startSession(+e.target.value)

    render() {
        return <Container>
            <Controls>
                <button onClick={this.props.nextStep}>next step</button>
                <div>
                    <label htmlFor="game-level-select">Select level:&nbsp;</label>
                    <select id="game-level-select" onChange={this.onLevelChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            </Controls>
            <ChildrenContainer>
                {this.props.children}
            </ChildrenContainer>
            {this.props.status === GameStatus.LOST &&
                <LostOverlay>
                    <h1>You lost</h1>
                    <button onClick={() => this.props.startSession(this.props.level)}>Try again</button>
                </LostOverlay>
            }
        </Container>
    }
}
export const GameContainer = connect(gameModuleStateSelector, apiActions)(GameContainerComponent)

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const ChildrenContainer = styled.div`
  width: 100%;
  overflow: auto;
`
const Container = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
`
const LostOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
`
