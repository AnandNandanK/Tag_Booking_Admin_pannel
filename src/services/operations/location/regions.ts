import axios from "axios";
import type { ApiResponse } from "../../../interfaces/country";
import { apiConnector } from "../../apiConnetor";
import type { AppDispatch } from "../../../store/store";
import { setRegion, setRegionError, type RegionError } from "../../../slices/locations/regionSlice";
// import { setRegions } from "./region";

interface RegionResponse {
  name: string,
  active: boolean
}

interface RegionProps {
  name: string,
  active: boolean,
  countryId: string
}


export function createRegions({ name, active, countryId }: RegionProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    console.log(countryId)
    try {
      const response = await apiConnector<ApiResponse<RegionResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/countries/${countryId}/regions`,
        bodyData: { name, active },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE REGION RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllRegions());
        return { success: true }; 
      }

      return { success: false }; 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: RegionError | null = error.response?.data?.data || null;
        dispatch(setRegionError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}



interface updateRegionProps {
  name: string,
  countryId: string,
  regionId: string,
}


export function updateRegions({ name, countryId, regionId }: updateRegionProps) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      //   dispatch(setCountryLoading(true));

      const response = await apiConnector<ApiResponse<null>>({
        method: "PUT",
        url: `https://thedemonstrate.com//ticketcore-api/api/v1/countries/${countryId}/regions/${regionId}`,
        bodyData: { name },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE REGION RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        // ✅ Save API response in Redux slice
        dispatch(listAllRegions());
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // dispatch(setCountryError(error.response?.data?.message || "Country fetch failed"));
        console.error("Axios error:", error.response?.data);
      } else {
        // dispatch(setCountryError("Unknown error"));
        console.error("Unknown error:", error);
      }
    } finally {
      //   dispatch(setCountryLoading(false));
    }
  };
}



interface RegionResponse {
  id: number,
  name: string,
  active: boolean,
  countryId: number,
  countryName: string
}


export function listAllRegions() {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      //   dispatch(setCountryLoading(true));

      const response = await apiConnector<ApiResponse<RegionResponse>>({
        method: "GET",
        url: "https://thedemonstrate.com/ticketcore-api/api/v1/regions?mode=all",
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("GET ALL COUNTRIES RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        // ✅ Save API response in Redux slice
        dispatch(setRegion(response.data.data));
        console.log(response.data.data)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // dispatch(setCountryError(error.response?.data?.message || "Country fetch failed"));
        console.error("Axios error:", error.response?.data);
      } else {
        // dispatch(setCountryError("Unknown error"));
        console.error("Unknown error:", error);
      }
    } finally {
      //   dispatch(setCountryLoading(false));
    }
  };
}



export const updateRegionStatus =({ id,countryId, active }: { id: number;countryId:number, active: boolean }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/countries/${countryId}/regions/${id}/status?active=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllRegions());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };