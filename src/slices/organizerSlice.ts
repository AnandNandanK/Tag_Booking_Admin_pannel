// src/features/organizer/organizerSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface organizerResponse {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  conatctPerson: string | null;
  websiteUrl: string;   // ✅ fixed typo (was websiteUr)
  active: boolean;      // ✅ should be boolean, not `true`
}

export interface organizerErrorResponse {
  name?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string | null;
  websiteUrl?: string;   // ✅ fixed typo (was websiteUr)
  active?: string;      // ✅ should be boolean, not `true`
}

// Slice
interface OrganizerState {
  data: organizerResponse[] | null;
  loading: boolean;
  error: organizerErrorResponse | null; // keep error simple
}

const initialState: OrganizerState = {
  data: null,
  loading: false,
  error: null,
};

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    setOrganizer: (state, action: PayloadAction<organizerResponse[]>) => {
      state.data = action.payload;
    },
    setOrganizerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrganizerError: (state, action: PayloadAction<organizerErrorResponse| null>) => {
      state.error = action.payload;
    },
    clearOrganizerError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setOrganizer,
  setOrganizerError,
  setOrganizerLoading,
  clearOrganizerError,
} = organizerSlice.actions;

export default organizerSlice.reducer;
