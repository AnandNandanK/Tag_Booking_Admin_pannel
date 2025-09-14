// src/features/Shows/ShowsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShowResponse {
  showId: number;
  showDate: string;     // "YYYY-MM-DD"
  startTime: string;    // "HH:mm:ss"
  endTime: string;      // "HH:mm:ss"
  eventId: number;
  eventName: string;
  venueId: number;
  venueName: string;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED"; // possible status values
  basePrice: number;
  bookingType:string
}

interface ShowErrorResponse {
  showDate?: string;
  startTime?: string;
  endTime?: string;
  eventId?: number;
  venueId?: number;
  basePrice?: number;
  bookingType?: number;
}

interface ShowsState {
  data: ShowResponse[]; // array of shows
  loading: boolean;
  error:ShowErrorResponse | null
}

const initialState: ShowsState = {
  data: [],
  loading: false,
  error:null
};

const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {
    setShows: (state, action: PayloadAction<ShowResponse[]>) => {
      state.data = action.payload;
    },

    setShowsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowError: (state, action: PayloadAction<ShowErrorResponse>) => {
      state.error = action.payload;
    },
  },
});

export const { setShows, setShowsLoading,setShowError } =
  showsSlice.actions;

export default showsSlice.reducer;
