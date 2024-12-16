import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AppState } from '../index';

const STORAGE_KEY = 'app_state';

export function loadState(): AppState | undefined {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

export function localStorageMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const savedState = loadState();
      if (savedState) {
        return savedState;
      }
    }

    const nextState = reducer(state, action);
    saveState(nextState);
    return nextState;
  };
}