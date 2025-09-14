// src/features/Facilities/FacilitiesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FacilitiesResponse {
    facilityId: number;
    name: string;
    description: string;
    active: boolean;
}

export interface facilitiesErrorResponse {
    name?: string;
    description?: string;
    active?: boolean;
}

// Slice
interface FacilityState {
    data: FacilitiesResponse[] | null;
    loading: boolean;
    error: facilitiesErrorResponse | null; // keep error simple
}

const initialState: FacilityState = {
    data: null,
    loading: false,
    error: null,
};

const facilitiesSlice = createSlice({
    name: "facility",
    initialState,
    reducers: {
        setFacilities: (state, action: PayloadAction<FacilitiesResponse[]>) => {
            state.data = action.payload;
        },
        setFacilitiesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setFacilitiesError: (state, action: PayloadAction<facilitiesErrorResponse | null>) => {
            state.error = action.payload;
        },
        clearFacilitiesError: (state) => {
            state.error = null;
        },
    },
});

export const {
setFacilities,setFacilitiesError,setFacilitiesLoading,clearFacilitiesError
} = facilitiesSlice.actions;

export default facilitiesSlice.reducer;
