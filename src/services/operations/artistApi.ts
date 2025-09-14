import axios from "axios";
import { apiConnector } from "../apiConnetor";

import {
  setArtists,
  setArtistsError,
  type ArtistErrorResponse,
  type ArtistResponse,
} from "../../slices/artistSlice";
import type { AppDispatch } from "../../store/store";
import type { OtherApiResponse } from "../../interfaces/country";



// ---------------------- List All Artists ----------------------
export function listAllArtists() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ArtistResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/artists`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("LIST ALL ARTISTS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setArtists(response.data.data));
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

// ---------------------- Create Artist ----------------------
interface CreateArtistProps {
  name: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string;
  nationality: string;
  websiteUrl: string;
  instagramHandle: string;
  twitterHandle: string;
}


export function createArtist(formData: CreateArtistProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ArtistResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/artists`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("CREATE ARTIST RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllArtists());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: ArtistErrorResponse | null =
          error.response?.data?.data || null;
        dispatch(setArtistsError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}


// ---------------------- Update Artist ----------------------
interface UpdateArtistProps {
  name: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string;
  nationality: string;
  websiteUrl: string;
  instagramHandle: string;
  twitterHandle: string;
}

export function updateArtist({
  id,
  formData,
}: {
  id: number;
  formData: UpdateArtistProps;
}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ArtistResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/artists/${id}`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("UPDATE ARTIST RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllArtists());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: ArtistErrorResponse | null =
          error.response?.data?.data || null;
        dispatch(setArtistsError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}


