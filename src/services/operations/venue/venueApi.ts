import axios from "axios";
import type { ApiResponse, OtherApiResponse } from "../../../interfaces/country";
import type { AppDispatch } from "../../../store/store";
import { apiConnector } from "../../apiConnetor";

import { setVenues,} from "../../../slices/venue/venueSlice";
import type { VenueResponse } from "../../../interfaces/venueInterFace";




export function listAllVenues() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<VenueResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/venues/paged`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL Venues RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setVenues(response.data.data));
        // dispatch(listAllRegions());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const fieldErrors: RegionError | null = error.response?.data?.data || null;
        // dispatch(setRegionError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}



// 👇 Image ka alag interface
interface VenueImage {
  imageUrl: string;
  caption?: string;       // optional agar kabhi caption na aaye
  displayOrder: number;
}

// 👇 Main Venue interface
export interface VenueRequest {
  name: string;
  address: string;
  description: string;
  cityId: number;
  pincode: string;
  latitude: number;
  longitude: number;
  venueType: string; // enum bana sakte ho agar fixed types hai
  totalCapacity: number;
  contactNumber: string;
  email: string;
  prohibitedItemsImageUrl: string;
  layoutSchemaImageUrl: string;
  supportedEvents: string[]; // jaise ["CONCERT", "CONFERENCE", "THEATER"]
  images: VenueImage[];
  facilityIds: number[];
}



export function createVenues( formData: VenueRequest) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    console.log(formData)
    try {
      const response = await apiConnector<ApiResponse<VenueResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/venues`,
        bodyData:formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE FACILITY RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllVenues());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const fieldErrors: VenuesErrorResponse | null = error.response?.data?.data || null;
        // dispatch(setVenuesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}
 




export function updateVenues({formData,id}:{formData:VenueRequest,id:number}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<VenueResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/venues/${id}`,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE Venue RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllVenues());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const fieldErrors: VenuesErrorResponse | null = error.response?.data?.data || null;
        // dispatch(setVenuesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}




export const updateVenueStatus =({ id, active }: { id: number; active: string }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/venues/${id}/status?status=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllVenues());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };