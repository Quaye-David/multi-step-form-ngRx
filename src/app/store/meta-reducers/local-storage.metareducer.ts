import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AppState } from '../index';

export function localStorageMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      const storedState = localStorage.getItem('appState');
      if (storedState) {
        try {
          return JSON.parse(storedState);
        } catch {
          localStorage.removeItem('appState');
        }
      }
    }

    localStorage.setItem('appState', JSON.stringify(nextState));
    return nextState;
  };
}