import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AppState } from '../index';

// Key used to store state in localStorage
const STORAGE_KEY = 'store_key';

/**
 * Loads the application state from localStorage
 * @returns The stored AppState or undefined if no state exists or on error
 */
export function loadState(): AppState | undefined {
  try {
    // Attempt to retrieve serialized state from localStorage
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;

    // Parse and return the stored state
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
}

/**
 * Saves the current application state to localStorage
 * @param state - The current AppState to be stored
 */
function saveState(state: AppState): void {
  try {
    // Serialize and save state to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

/**
 * MetaReducer that handles saving and loading state from localStorage
 * Implements persistence layer for NgRx store
 * @param reducer - The original reducer function
 * @returns A new reducer that includes localStorage persistence
 */
export function localStorageMetaReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return (state, action) => {
    // On app initialization or state update
    if (action.type === INIT || action.type === UPDATE) {
      const savedState = loadState();
      // If there's a saved state, use it as initial state
      if (savedState) {
        return savedState;
      }
    }

    // Process the action with the original reducer
    const nextState = reducer(state, action);
    // Save the new state to localStorage
    saveState(nextState);
    return nextState;
  };
}