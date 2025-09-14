import type { AppDispatch } from "../../../store/store";
import { apiConnector } from "../../apiConnetor";
import { city_endpoints } from "../../apis/location";
import type { ApiResponse, Country } from "../../../interfaces/country";
import axios from "axios";
import { setCountries, setCountryLoading, setCountryError, type CountryError } from "../../../slices/locations/countrySlice"

const { COUNTRY_LIST_API, CREATE_COUNTRY_API } = city_endpoints;


export function getAllCountries() {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setCountryLoading(true));

      const response = await apiConnector<ApiResponse<Country>>({
        method: "GET",
        url: COUNTRY_LIST_API,
         headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("GET ALL COUNTRIES RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        // ✅ Save API response in Redux slice 
       dispatch(setCountries(response.data.data)); 
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setCountryError(error.response?.data?.message || "Country fetch failed"));
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      dispatch(setCountryLoading(false));
    }
  };
}


export type CreateCountryProps={
  name:string,
  code:string,
  phoneCode:string,
  active:string
}

export function CreateCountries(formData: CreateCountryProps) {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      dispatch(setCountryLoading(true));

      const response = await apiConnector<{
        statusCode: number;
        massage: string;
      }>({
        method: "POST",
        url: CREATE_COUNTRY_API,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE COUNTRIES RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        // ✅ Success case
        dispatch(getAllCountries());
        return true; // <--- return success
      }

      return false; // agar statusCode 201 nahi hai
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: CountryError | null =
          error.response?.data?.data || null;
        dispatch(setCountryError(fieldErrors));
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
      return false; // <--- failure case
    } finally {
      dispatch(setCountryLoading(false));
    }
  };
}



export type UpdateCountryProps={
  name:string,
  code:string,
  phoneCode:string,
}

type formItems={
    formData:CreateCountryProps,
    editCountryId:number | null
}
export function UpdateCountries({formData,editCountryId}:formItems) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setCountryLoading(true));

      const response = await apiConnector<{
        statusCode:number,
        massage:string
      }>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/countries/${editCountryId}`,
        bodyData: formData,
         headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE COUNTRY RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        // ✅ Save API response in Redux slice
        dispatch(getAllCountries());
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setCountryError(error.response?.data?.message || "Create Country fetch failed"));
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      dispatch(setCountryLoading(false));
    }
  };
}


export const updateCountryStatus =({ id, active }: { id: number; active: boolean }) =>
  async (dispatch:AppDispatch) => {
    try {
     const statusResponse= await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/countries/${id}/status?active=${active}`,
        withCredentials: true,
      });

   console.log(statusResponse);

      // ✅ Refresh countries list
      dispatch(getAllCountries());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };