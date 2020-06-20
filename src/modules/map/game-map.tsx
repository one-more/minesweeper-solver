import React, {PureComponent} from "react";
import {MapModuleState} from "./reducer";
import {connect} from "react-redux";
import {mapModuleStateSelector} from "./selectors";
import styled from "@emotion/styled";
import {apiActions} from "~/modules/api";
import {CellStatus} from "~/modules/matrix";

export type GameMapProps = MapModuleState & {
    openByCoords: (x: number, y: number) => void
}
export class GameMapComponent extends PureComponent<GameMapProps> {
    render(): JSX.Element {
        return <Container>
            {
                this.props.matrix
                    .map(
                        (row, rowIndex) =>
                            <Row key={rowIndex}>
                                {
                                    row.map((cell, cellIndex) =>
                                        <Cell
                                            status={cell.status}
                                            key={cellIndex}
                                            onClick={() => this.props.openByCoords(cellIndex, rowIndex)}
                                        >
                                            {cell.hint === -1 ? '' : cell.hint}
                                        </Cell>)
                                }
                            </Row>
                    )
            }
        </Container>
    }
}
export const GameMap = connect(mapModuleStateSelector, apiActions)(GameMapComponent)

const Container = styled.div``
const Row = styled.div`
  display: flex;
  width: max-content;
  margin: auto;
`

type CellProps = {
    status: CellStatus
}
const Cell = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid grey;
  cursor: pointer;
  background: ${({status}: CellProps): string => status === CellStatus.LOOSE ? 'red' : ''};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
