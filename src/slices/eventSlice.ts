// src/features/Events/EventsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EventResponse } from "../interfaces/eventInterFace";


export interface EventsErrorResponse {
  artists?: string;
  basePrice?: string;
  durationMinutes?: string;
  languages?: string;
  name?: string;
  shortDescription?: string;
}


interface EventsState {
  data: EventResponse[] | null;
  loading: boolean;
  error: EventsErrorResponse | null;
}

const initialState: EventsState = {
  data: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventResponse[]>) => {
      state.data = action.payload;
    },
    setEventsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEventsError: (state, action: PayloadAction<EventsErrorResponse | null>) => {
      state.error = action.payload;
    },
    clearEventsError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setEvents,
  setEventsLoading,
  setEventsError,
  clearEventsError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
