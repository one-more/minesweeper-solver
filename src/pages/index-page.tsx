import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {apiActions} from "~/modules/api";
import {GameMap} from "~/modules/map";
import {GameContainer} from "~/modules/game";
import styled from "@emotion/styled";

export type IndexPageProps = {
    startSession: (level: number) => void
}
export class IndexPageComponent extends PureComponent<IndexPageProps> {
    componentDidMount() {
        this.props.startSession(1)
    }

    render(): JSX.Element {
        return <PageContent>
            <GameContainer>
                <GameMap />
            </GameContainer>
        </PageContent>
    }
}
const state = {}
export const IndexPage = connect(() => state, apiActions)(IndexPageComponent)

const PageContent = styled.div`
  text-align: center;
`
