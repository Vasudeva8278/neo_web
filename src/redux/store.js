import { configureStore } from '@reduxjs/toolkit';
import templateReducer from './slice/templateSlice';
import documentReducer from './slice/documentSlice';


const store = configureStore({
  reducer: {
    templates: templateReducer,
    documents: documentReducer,
  }
});

export default store;