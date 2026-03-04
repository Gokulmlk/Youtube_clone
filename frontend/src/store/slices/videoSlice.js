import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchVideos = createAsyncThunk('video/fetchAll', async (params, thunkAPI) => {
  try {
    const res = await API.get('/videos', { params })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch videos')
  }
})

export const fetchVideoById = createAsyncThunk('video/fetchById', async (id, thunkAPI) => {
  try {
    const res = await API.get(`/videos/${id}`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch video')
  }
})

export const fetchVideosByChannel = createAsyncThunk('video/byChannel', async (channelId, thunkAPI) => {
  try {
    const res = await API.get(`/videos/channel/${channelId}`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const uploadVideo = createAsyncThunk('video/upload', async (data, thunkAPI) => {
  try {
    const res = await API.post('/videos', data)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Upload failed')
  }
})

export const updateVideo = createAsyncThunk('video/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await API.put(`/videos/${id}`, data)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const deleteVideo = createAsyncThunk('video/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/videos/${id}`)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed')
  }
})

export const likeVideo = createAsyncThunk('video/like', async (id, thunkAPI) => {
  try {
    const res = await API.put(`/videos/${id}/like`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const dislikeVideo = createAsyncThunk('video/dislike', async (id, thunkAPI) => {
  try {
    const res = await API.put(`/videos/${id}/dislike`)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videos: [],
    currentVideo: null,
    channelVideos: [],
    loading: false,
    error: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {
    clearCurrentVideo: (state) => { state.currentVideo = null },
    clearVideoError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload.videos
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchVideos.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchVideoById.pending, (state) => { state.loading = true; state.error = null; state.currentVideo = null })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false
        state.currentVideo = action.payload.video
      })
      .addCase(fetchVideoById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchVideosByChannel.fulfilled, (state, action) => {
        state.channelVideos = action.payload.videos
      })
      .addCase(uploadVideo.pending, (state) => { state.loading = true; state.error = null })
      .addCase(uploadVideo.fulfilled, (state) => { state.loading = false })
      .addCase(uploadVideo.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter(v => v._id !== action.payload)
        state.channelVideos = state.channelVideos.filter(v => v._id !== action.payload)
      })
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likeCount = action.payload.likeCount
          state.currentVideo.dislikeCount = action.payload.dislikeCount
        }
      })
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likeCount = action.payload.likeCount
          state.currentVideo.dislikeCount = action.payload.dislikeCount
        }
      })
  }
})

export const { clearCurrentVideo, clearVideoError } = videoSlice.actions
export default videoSlice.reducer