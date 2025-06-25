import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import { getDocumentsWithTemplateNames } from '../../services/documentApi';


export const fetchDocumentsWithTemplateNames = createAsyncThunk(
  'documents/fetchDocumentsWithTemplateNames',
  async () => {
    const response = await getDocumentsWithTemplateNames();
    return response;
  }
);
const documentSlice = createSlice({
    name:'documents',
    initialState:{
        documents:[],
        status:'idle',
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{  
        builder
        .addCase(fetchDocumentsWithTemplateNames.pending,(state)=>{
            state.status='loading';
        })
        .addCase(fetchDocumentsWithTemplateNames.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.documents=action.payload;
        })
        .addCase(fetchDocumentsWithTemplateNames.rejected,(state,action)=>{
            state.status='failed';
            state.error=action.error.message;
        })  


    }
})

export default documentSlice.reducer;
