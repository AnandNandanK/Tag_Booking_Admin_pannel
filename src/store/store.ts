import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice"
import countryReducer from "../slices/locations/countrySlice"
import regionReducer from "../slices/locations/regionSlice"
import cityReducer from "../slices/locations/citiesSlice"
import organizerReducer from "../slices/organizerSlice"
import facilityReducer from "../slices/venue/facilitiesSlice"
import venueReducer from "../slices/venue/venueSlice"
import artistReducer from "../slices/artistSlice"
import eventReducer from "../slices/eventSlice"
import showReducer from "../slices/showSlice"
import ticketCategoryReducer from "../slices/ticketCategorySlice"

export const store = configureStore({
  
  reducer: {
    auth: authReducer,
    user:userReducer,
    country:countryReducer,
    region:regionReducer,
    city:cityReducer,
    organizer:organizerReducer,
    facilities:facilityReducer,
    venues:venueReducer,
    artist:artistReducer,
    event:eventReducer,
    shows:showReducer,
    ticketCategory:ticketCategoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
