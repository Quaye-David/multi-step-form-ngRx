import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { formReducer } from './form/form.reducer';
import { FormState } from './form/form.state';
import { localStorageMetaReducer } from './meta-reducers/local-storage.metareducer';

export interface AppState {
  form: FormState;
}

export const reducers: ActionReducerMap<AppState> = {
  form: formReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [localStorageMetaReducer];

export * from './form/form.actions';
export * from './form/form.selectors';