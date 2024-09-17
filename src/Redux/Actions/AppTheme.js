import * as actionType from './ActionTypes';

export function setAppTheme(obj) {
    localStorage.setItem("Theme", obj.theme);
    return { type: actionType.SET_APP_THEME, obj };
}