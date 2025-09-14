

// src/features/country/countrySlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { PageData, Country } from "../../interfaces/country"; // <- aapke interfaces

interface CountryState {
  data: PageData<Country> | null; // content, page, size, totalElements, totalPages, last
  loading: boolean;
  error: CountryError | null;
}

const initialState: CountryState = {
  data: null,
  loading: false,
  error: null ,
};

export interface CountryError {
  name?: string;
  code?: string;
  phoneCode?: string;
  active?: string;
}


const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountries: (state, action: PayloadAction<PageData<Country>>) => {
      state.data = action.payload;
    },
    setCountryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCountryError: (state, action: PayloadAction<CountryError | null>) => {
      state.error = action.payload;
    },
    clearCountries: (state) => {
      state.data = null;
    },
  },
});

export const { setCountries, setCountryLoading, setCountryError, clearCountries } = countrySlice.actions;
export default countrySlice.reducer;
