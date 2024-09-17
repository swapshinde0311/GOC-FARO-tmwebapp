import * as actionType from '../Actions/ActionTypes';
import { ThemeType } from '@scuf/common';

const initState = {
    theme: ThemeType.Light
}

export default function AppThemeReducer(state = initState, action) {
    switch (action.type) {
        case actionType.SET_APP_THEME: return {
            ...state,
            theme: action.obj.theme
        };
        default:
            return state;
    }
} 