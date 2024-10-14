import { legacy_createStore as createStore } from 'redux';
import { combineReducers } from 'redux';

const initialState = {
    usuario: '',
};

const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GUARDAR_USUARIO':
        return { ...state, usuario: action.usuario };
        default:
        return state;
    }
};

const rootReducer = combineReducers({
    usuario: usuarioReducer,
});
const store = createStore(rootReducer);
export default store;