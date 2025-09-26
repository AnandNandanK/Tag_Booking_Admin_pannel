import axios from "axios";
import { apiConnector } from "../apiConnetor";

import {
  setErrorMassage,
  setEvents,
  setEventsError,
  type EventsErrorResponse,
} from "../../slices/eventSlice";
import type { AppDispatch } from "../../store/store";
import type { OtherApiResponse } from "../../interfaces/country";
import type { EventResponse } from "../../interfaces/eventInterFace";



// ---------------------- List All Events ----------------------
export function listAllEvents() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<EventResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/events`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

    //   console.log("LIST ALL EVENTS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setEvents(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}


// ---------------------- Create Event ----------------------

export interface ArtistSelection {
  artistId: number;
  role: string;
}

export interface CreateEventProps {
  name: string;
  shortDescription: string;
  longDescription: string;
  termsAndConditions: string[];
  category: string;
  genre: string;
  languages: string[];
  durationMinutes: number;
  ageRestriction: number;
  certification: string;
  releaseDate: string;
  posterUrl: string;
  thumbnailUrl: string;
  trailerUrl: string;
  basePrice: number;
  organizerId: number;
  artists: ArtistSelection[]; // send artist IDs
}


export function createEvent(formData: CreateEventProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    console.log(formData)
    try {
      const response = await apiConnector<OtherApiResponse<EventResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/events`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("CREATE EVENT RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllEvents());
        return { success: true };
      }

      return { success: false };
      
    } catch (error) {
      if (axios.isAxiosError(error)) {


        const fieldErrors: EventsErrorResponse| null =
          error.response?.data?.data || null;
        dispatch(setEventsError(fieldErrors));
        console.error("Axios error:", error.response);


      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}

// ---------------------- Update Event ----------------------


export function updateEvent({
  id,
  formData,
}: {
  id: number;
  formData: CreateEventProps;
}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<EventResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/events/${id}`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("UPDATE EVENT RESPONSE:", response);

      if (response.data.statusCode === 200) {
        dispatch(listAllEvents());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: EventsErrorResponse | null =
          error.response?.data?.data || null;
        dispatch(setEventsError(fieldErrors));

        console.error("Axios error:", error.response);

        console.log(error.response?.data.message);

        dispatch(setErrorMassage(error.response?.data.message))

      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}




export const updateVenueStatus =({ id, status }: { id: number; status: string }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/events/${id}/status?status=${status}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllEvents());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

