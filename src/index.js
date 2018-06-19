import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import InstanceReducer from './reducers/instances';
import App from './container/App';

import registerServiceWorker from './registerServiceWorker';

const store = createStore(
    InstanceReducer,
    window.devToolsExtension && window.devToolsExtension()
);
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
