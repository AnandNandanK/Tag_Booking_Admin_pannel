import axios from "axios";
import type { ApiResponse } from "../../../interfaces/country";
import type { AppDispatch } from "../../../store/store";
import { apiConnector } from "../../apiConnetor";
import { setCities, setCitiesError, type CitiesError, type citiesResponse } from "../../../slices/locations/citiesSlice";




export function listAllCities() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<citiesResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/cities?mode=all`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("LIST ALL CITIES RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setCities(response.data.data));
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




interface createCityResponse {
  id: number,
  name: string,
  active: boolean,
  regionId: number,
  regionName: string,
  countryId: number,
  countryName: string
}


interface createProps {
  name: string,
  active: string,
  regionId: string
}


export function createCities({ name, active, regionId }: createProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<createCityResponse>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/regions/${regionId}/cities`,
        bodyData: { name, active },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("CREATE CITY RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllCities());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: CitiesError | null = error.response?.data?.data || null;
        dispatch(setCitiesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}



interface updateCityResponse {
  id: number,
  name: string,
  active: boolean,
  countryId: number,
  countryName: string
}

interface updateProps {
  name: string,
  countryId:string,
  regionId: string
}


export function updateCity({ name,countryId, regionId }: updateProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<updateCityResponse>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/countries/${countryId}/regions/${regionId}`,
        bodyData: { name},
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE CITY RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllCities());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: CitiesError | null = error.response?.data?.data || null;
        dispatch(setCitiesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}




export const updateCityStatus =({ id,regionId, active }: { id: number;regionId:number; active: boolean }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/regions/${regionId}/cities/${id}/status?active=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(listAllCities());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };