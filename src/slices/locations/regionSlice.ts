// src/features/country/countrySlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { PageData} from "../../interfaces/country"; // <- aapke interfaces


export interface RegionResponse {
  id: number,
  name:string ,
  active: boolean,
  countryId: number,
  countryName:string
}

export interface RegionError {
  name?: string;
  active?: string;
  countryId?: string;
}

interface RegionState {
  data: PageData<RegionResponse> | null;
  loading: boolean;
  error: RegionError | null; // 👈 ab object me store
}

const initialState: RegionState = {
  data: null,
  loading: false,
  error: null,
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<PageData<RegionResponse>>) => {
      state.data = action.payload;
    },
    setRegionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRegionError: (state, action: PayloadAction<RegionError | null>) => {
      state.error = action.payload;
    },
    clearRegion: (state) => {
      state.data = null;
      state.error = null;
    },
  },
});

export const { setRegion, setRegionLoading, setRegionError, clearRegion } =
  regionSlice.actions;
export default regionSlice.reducer;


