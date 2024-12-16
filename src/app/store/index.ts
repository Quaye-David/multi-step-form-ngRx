import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { formReducer } from './form/form.reducer';
import { FormState } from './form/form.state';

// Root state interface
export interface AppState {
  form: FormState;
}

// Root reducers
export const reducers: ActionReducerMap<AppState> = {
  form: formReducer
};

// Meta-reducers configuration
export const metaReducers: MetaReducer<AppState>[] = [];

// Re-export form store items
export * from './form/form.actions';
export * from './form/form.selectors';