import axios from "axios";
import type { ApiResponse, OtherApiResponse } from "../../../interfaces/country";
import type { AppDispatch } from "../../../store/store";
import { apiConnector } from "../../apiConnetor";

import { setFacilities, setFacilitiesError, type facilitiesErrorResponse, type FacilitiesResponse, } from "../../../slices/venue/facilitiesSlice";




export function listAllFacilities() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<FacilitiesResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/facilities`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL FACILITIES RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setFacilities(response.data.data));
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






interface createProps {
  name: string,
  description:string,
}


export function createFacilities({ name,description}: createProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<FacilitiesResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/facilities`,
        bodyData: { name, description },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE FACILITY RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllFacilities());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: facilitiesErrorResponse | null = error.response?.data?.data || null;
        dispatch(setFacilitiesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}
 



interface updateProps {
  name: string,
  description:string,
}


export function updateFacilities({id,formData}:{id:number,formData:updateProps}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<FacilitiesResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/facilities/${id}`,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE CITY RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllFacilities());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: facilitiesErrorResponse | null = error.response?.data?.data || null;
        dispatch(setFacilitiesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}




export const updateFacilityStatus =({ id, active }: { id: number; active: boolean }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/facilities/${id}/status?active=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllFacilities());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };