import type { OtherApiResponse } from "../../interfaces/country";
import { setShows, type ShowResponse } from "../../slices/showSlice";
import type { AppDispatch } from "../../store/store";
import { apiConnector } from "../apiConnetor";



// ✅ List all shows
export function listAllShows() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL SHOWS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setShows(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}





// ✅ Create show
interface createShowProps {
  showDate: string;
  startTime: string;
  endTime: string;
  eventId: number;
  venueId: number;
  basePrice: number;
}




export function createShow(formData: createShowProps) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<{ data: ShowResponse; statusCode: number }>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows`,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("CREATE SHOW RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllShows());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error creating show:", error);
      return { success: false };
    }
  };
}





export function updateShow({ id, formData }: { id: number; formData: createShowProps }) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<{ data: ShowResponse; statusCode: number }>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/${id}`,
        bodyData: formData,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("UPDATE SHOW RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllShows());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error updating show:", error);
      return { success: false };
    }
  };
}




// ✅ Update show status
export const updateShowStatus = ({ id, status }: { id: number; status:string}) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/${id}/status?status=${status}`,
        withCredentials: true,
      });

      console.log("UPDATE SHOW STATUS RESPONSE:", response);

      dispatch(listAllShows());
    } catch (err) {
      console.error("Show status update failed:", err);
    }
  };



  // ✅ List all shows
export function listAllShowsByEvent(eventId:number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/event/${eventId}`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL SHOWS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setShows(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}
