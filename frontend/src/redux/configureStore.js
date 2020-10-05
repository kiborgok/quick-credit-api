import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import rootReducer from './reducers/rootReducer';
//import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

const configureStore = initialState => {
    //add support to redux-dev-tools
    //const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
        //composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
    );
}

export default configureStore;