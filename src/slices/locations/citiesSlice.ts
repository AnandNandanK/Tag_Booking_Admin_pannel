// src/features/country/countrySlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { PageData} from "../../interfaces/country"; // <- aapke interfaces


export interface citiesResponse {
  id: number,
  name:string ,
  active: boolean,
  regionId:number,
  regionName:string,
  countryId: number,
  countryName:string
}


interface CitiesState {
  data: PageData<citiesResponse> | null;
  loading: boolean;
  error: CitiesError | null; // 👈 ab object me store
}

const initialState: CitiesState = {
  data: null,
  loading: false,
  error: null,
};

export interface CitiesError {
  name?: string;
  active?: string;
  countryId?: string;
}


const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<PageData<citiesResponse>>) => {
      state.data = action.payload;
    },
    setCitiesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCitiesError: (state, action: PayloadAction<CitiesError | null>) => {
      state.error = action.payload;
    },
    clearCitiesError: (state) => {
      state.error = null;
    },
  },
});

export const { setCities,setCitiesLoading,setCitiesError,clearCitiesError } =
  regionSlice.actions;
export default regionSlice.reducer;


