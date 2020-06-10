import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IndexPage} from "~/pages/index-page";
import {Provider} from "react-redux";
import {store} from "~/modules/store";

ReactDOM.render(<Provider store={store}>
    <IndexPage />
</Provider>, document.getElementById('root'));
