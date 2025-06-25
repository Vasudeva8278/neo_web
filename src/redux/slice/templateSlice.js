import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTemplates, getTemplatesByProjectId } from '../../services/templateApi';

export const fetchAllTemplates = createAsyncThunk(
  'templates/fetchAllTemplates',
  async () => {
    const response = await getTemplates();
    return response;
  }
);

export const fetchTemplatesByProjectId = createAsyncThunk(
  'templates/fetchTemplatesByProjectId',
  async (projectId) => {
    const response = await getTemplatesByProjectId(projectId);
    return response;
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTemplates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates = action.payload;
      })
      .addCase(fetchAllTemplates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTemplatesByProjectId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplatesByProjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates = action.payload;
      })
      .addCase(fetchTemplatesByProjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default templateSlice.reducer;
