import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchChannels = createAsyncThunk('channel/fetchAll', async (_, thunkAPI) => {
  try { const res = await API.get('/channels'); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const fetchChannelById = createAsyncThunk('channel/fetchById', async (id, thunkAPI) => {
  try { const res = await API.get(`/channels/${id}`); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const fetchMyChannels = createAsyncThunk('channel/myChannels', async (_, thunkAPI) => {
  try { const res = await API.get('/channels/user/my-channels'); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const createChannel = createAsyncThunk('channel/create', async (data, thunkAPI) => {
  try { const res = await API.post('/channels', data); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const updateChannel = createAsyncThunk('channel/update', async ({ id, data }, thunkAPI) => {
  try { const res = await API.put(`/channels/${id}`, data); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const deleteChannel = createAsyncThunk('channel/delete', async (id, thunkAPI) => {
  try { await API.delete(`/channels/${id}`); return id }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const toggleSubscribe = createAsyncThunk('channel/subscribe', async (id, thunkAPI) => {
  try { const res = await API.put(`/channels/${id}/subscribe`); return res.data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed') }
})

const channelSlice = createSlice({
  name: 'channel',
  initialState: { channels: [], currentChannel: null, myChannels: [], loading: false, error: null },
  reducers: {
    clearChannelError: (state) => { state.error = null },
    clearCurrentChannel: (state) => { state.currentChannel = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => { state.loading = true })
      .addCase(fetchChannels.fulfilled, (state, action) => { state.loading = false; state.channels = action.payload.channels })
      .addCase(fetchChannels.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchChannelById.pending, (state) => { state.loading = true })
      .addCase(fetchChannelById.fulfilled, (state, action) => { state.loading = false; state.currentChannel = action.payload.channel })
      .addCase(fetchChannelById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyChannels.fulfilled, (state, action) => { state.myChannels = action.payload.channels })
      .addCase(createChannel.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createChannel.fulfilled, (state, action) => { state.loading = false; state.myChannels.push(action.payload.channel) })
      .addCase(createChannel.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateChannel.fulfilled, (state, action) => {
        const idx = state.myChannels.findIndex(c => c._id === action.payload.channel._id)
        if (idx !== -1) state.myChannels[idx] = action.payload.channel
        if (state.currentChannel?._id === action.payload.channel._id) state.currentChannel = action.payload.channel
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.myChannels = state.myChannels.filter(c => c._id !== action.payload)
      })
      .addCase(toggleSubscribe.fulfilled, (state, action) => {
        if (state.currentChannel) {
          state.currentChannel.subscribers = action.payload.subscribers
          state.currentChannel.subscribed = action.payload.subscribed
        }
      })
  }
})

export const { clearChannelError, clearCurrentChannel } = channelSlice.actions
export default channelSlice.reducer