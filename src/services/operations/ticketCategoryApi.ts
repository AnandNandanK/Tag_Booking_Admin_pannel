import axios from "axios";
import { apiConnector } from "../apiConnetor";

import {
  setTicketCategories,
  setTicketCategoriesError,
  type TicketCategoryErrorResponse,
} from "../../slices/ticketCategorySlice";
import type { AppDispatch } from "../../store/store";
import type { OtherApiResponse } from "../../interfaces/country";
import type { TicketCategory } from "../../slices/ticketCategorySlice";




// ---------------------- List All Ticket Categories ----------------------
export function listAllTicketCategories() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/ticketcategories`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      if (response.data.statusCode === 200) {
        dispatch(setTicketCategories(response.data.data));
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



// Layout ka interface
export interface Layout {
  rows: number;
  seatsPerRow: number;
  rowLabels: string[];
}

// Ticket Category ka interface
export interface TicketCategoryResponse {
  name: string;
  price: number;
  capacity: number;
  description: string;
  layout?: Layout; // optional banaya hai, agar GENERAL_ADMISSION ho to layout ki zaroorat nahi
}



// ---------------------- Create Ticket Category ----------------------
export function createTicketCategory({formData,showId}:{ formData:TicketCategoryResponse,showId:number}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/${showId}/ticketcategories`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("CREATE TICKET CATEGORY RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        dispatch(listAllTicketCategories());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: TicketCategoryErrorResponse | null =
          error.response?.data?.data || null;
        dispatch(setTicketCategoriesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}

// ---------------------- Update Ticket Category ----------------------
export function updateTicketCategory({
  id,
  formData,
}: {
  id: number;
  formData: TicketCategoryResponse;
}) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory>>({
        method: "PUT",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/1/ticketcategories/${id}`,
        bodyData: formData,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("UPDATE TICKET CATEGORY RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(listAllTicketCategories());
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const fieldErrors: TicketCategoryErrorResponse | null =
          error.response?.data?.data || null;
        dispatch(setTicketCategoriesError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}

// ---------------------- Update Ticket Category Status ----------------------
export const updateTicketCategoryStatus =
  ({ id, status }: { id: number; status: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const statusResponse = await apiConnector({
        method: "PATCH",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/ticket-categories/${id}/status?status=${status}`,
        withCredentials: true,
      });

      console.log("UPDATE STATUS RESPONSE:", statusResponse);

      // ✅ Refresh list after status change
      dispatch(listAllTicketCategories());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };
