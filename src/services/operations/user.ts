import { apiConnector } from "../apiConnetor";
import { clearUser, setUser } from "../../slices/userSlice";
import axios from "axios";
import { userEndpoint } from "../apis/authApis";
import { setLoading } from "../../slices/authSlice";
import type { AppDispatch } from "../../store/store";

const { GET_USER_API} = userEndpoint;



export type GetUserApiResponse = {
  statusCode:number;
  message?: string;
  data: {
    userId: string;
    email: string;
    mobile:string;
    accountStatus:string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    avatarUrl: string;
    roles:string[];
  };
};


export function getCurrentUser() {

  return async (dispatch: AppDispatch): Promise<void> => {
    try {
        dispatch(setLoading(true));
      const response = await apiConnector<GetUserApiResponse>({
        method: "GET",
        url: GET_USER_API,
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });

      console.log("GET CURRENT USER RESPONSE:", response);

      if (response.data.statusCode === 200) {
        dispatch(setUser(response?.data?.data));
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // toast.error(error.response?.data?.message || "User fetch failed");

        dispatch(clearUser());
        console.error("Error fetching user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
        dispatch(setLoading(false));
    }
  };
}
