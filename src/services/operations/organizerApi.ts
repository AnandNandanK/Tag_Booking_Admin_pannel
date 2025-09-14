import axios from "axios";
import type {  OtherApiResponse } from "../../interfaces/country";
import { setOrganizer, setOrganizerError, type organizerErrorResponse, type organizerResponse } from "../../slices/organizerSlice";
import type { AppDispatch } from "../../store/store";
import { apiConnector } from "../apiConnetor";



export function listAllOrganizers() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<organizerResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/organizers`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

    //   console.log("LIST ALL ORGANIZER RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        console.log("setting data in slice")
        console.log(response.data.data)
        dispatch(setOrganizer(response.data.data));
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



export function createOrganizers({name,description,contactEmail,conatctPerson,contactPhone,websiteUrl}:organizerResponse) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
        console.log(name,description,contactEmail,conatctPerson,contactPhone,websiteUrl)
      const response = await apiConnector<OtherApiResponse<organizerResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/organizers`,
        bodyData:{name,description,contactEmail,conatctPerson,contactPhone,websiteUrl},
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE ORGANIZER RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllOrganizers());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: organizerErrorResponse | null = error.response?.data?.data || null;
        dispatch(setOrganizerError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}



export function updateOrganizers({ id, formData }: { id: number; formData: organizerResponse }) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    console.log(id)
    try {
      const response = await apiConnector<OtherApiResponse<organizerResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/organizers/${id}`,
        bodyData:formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE ORGANIZER RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllOrganizers());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
         const fieldErrors: organizerErrorResponse | null = error.response?.data?.data || null;
        dispatch(setOrganizerError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}




export const updateOrganiserStatus =({ organiserId, active }: { organiserId:number, active: boolean }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/organizers/${organiserId}/status?active=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllOrganizers());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };