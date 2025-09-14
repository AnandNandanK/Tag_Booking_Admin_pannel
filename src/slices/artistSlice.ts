import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// API Response type
export interface ArtistResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string; // string format "YYYY-MM-DD"
  nationality: string;
  websiteUrl: string;
  instagramHandle: string;
  twitterHandle: string;
  active: boolean;
}

// Error type (optional fields, based on validations)
export interface ArtistErrorResponse {
  name?: string;
  description?: string;
  imageUrl?: string;
  dateOfBirth?: string;
  nationality?: string;
  websiteUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  active?: boolean;
}

// Slice state
interface ArtistState {
  data: ArtistResponse[] | null;
  loading: boolean;
  error: ArtistErrorResponse | null;
}

const initialState: ArtistState = {
  data: null,
  loading: false,
  error: null,
};

const artistsSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtists: (state, action: PayloadAction<ArtistResponse[]>) => {
      state.data = action.payload;
    },
    setArtistsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setArtistsError: (state, action: PayloadAction<ArtistErrorResponse | null>) => {
      state.error = action.payload;
    },
    clearArtistsError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { setArtists, setArtistsLoading, setArtistsError, clearArtistsError } =
  artistsSlice.actions;

// Export reducer
export default artistsSlice.reducer;
