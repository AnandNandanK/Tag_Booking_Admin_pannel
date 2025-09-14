import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import { apiConnector } from "../apiConnetor";
import { setAccessTokenExpiry, setLoading, setMassage, setOtpContext, setPwdToken, setRefreshTokenExpiry, setTempToken } from "../../slices/authSlice";
import axios from "axios";
import { endpoints } from "../apis/authApis";
import { clearUser } from "../../slices/userSlice";
import { getCurrentUser } from "./user";

const {
    LOGIN_API,
    LOGOUT_API
}=endpoints


interface FormItems {
    email:string,
    password:string
}

//SING IN 
export function signIn(
  formData:FormItems,
  navigate: NavigateFunction,
) {
  return async ( dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));

      const response = await apiConnector<{
        message: string;
        statusCode: number;
        data: {
          accessTokenExpiry: string;
          refreshTokenExpiry: string;
          tempToken?: string; // ✅ tempToken optional
          pwdChangeToken?: string; // ✅ tempToken optional
        };
      }>({
        method: "POST",
        url: LOGIN_API,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      const data = response.data;
      console.log("LOGIN API RESPONSE............", data);

      const { accessTokenExpiry, refreshTokenExpiry, tempToken, pwdChangeToken } = data.data;

      const aceessTokenExpirTime = new Date(accessTokenExpiry);
      const refrehTokenExpirTime = new Date(refreshTokenExpiry);
      const now = new Date();

      console.log("current time : ", now.toLocaleTimeString())
      console.log("accessTokenExpiry Time :" ,aceessTokenExpirTime.toLocaleTimeString());
      console.log("refreshTokenExpiry Time :",refrehTokenExpirTime.toLocaleTimeString());

      if (data.statusCode === 200) {
       await  dispatch(getCurrentUser());
        localStorage.setItem("accessTokenExpiry", accessTokenExpiry);
        localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry);

        dispatch(setAccessTokenExpiry(accessTokenExpiry));
        dispatch(setRefreshTokenExpiry(refreshTokenExpiry));

        if (tempToken) {
          // ✅ 2FA user → navigate to OTP verify page
          dispatch(setTempToken(tempToken)) // store tempToken for OTP verification
          dispatch(setOtpContext("2FA"))
          navigate("/otpverification");
        }else if(pwdChangeToken){
              navigate("/change-password");
              dispatch(setPwdToken(pwdChangeToken));
        } else {
          // ✅ Normal user → navigate to home
          dispatch(setOtpContext("signup"))
          navigate("/dashboard");
        }
      } else if( data.statusCode === 409) {
        navigate("/forgetpassword")
        // dispatch(setMassage(response.data.message));
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setMassage(error.response?.data?.message || "Login failed"));
        console.log("LOGIN API ERROR RESPONSE............", error);
      } else {
        console.log("LOGIN ERROR............", "An unknown error occurred.");
        // toast.error("Something went wrong");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
}


//LOGOUT
export function logout(
  navigate: NavigateFunction,
) {
  return async (dispatch:AppDispatch): Promise<void> => {
    try {
      // Make logout API call if needed
      dispatch(setLoading(true))
      const response = await apiConnector({
        method: "POST",
        url: LOGOUT_API, // ✅ Use the correct endpoint
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",

        },
      });

      console.log(response);
      localStorage.removeItem("accessToken"); // or your actual key
      localStorage.removeItem("accessTokenExpiry"); // or your actual key
      dispatch(setAccessTokenExpiry(""));
      dispatch(setTempToken(""));
      dispatch(setOtpContext(""));
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout Error:", error.response?.data?.message);
      } else {
        console.error("Unexpected Logout Error:", error);
      }
    }finally{
      dispatch(setLoading(false))
    }
  };
}

