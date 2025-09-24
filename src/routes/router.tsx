// router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Countries from "../features/dashboard/pages/Countries";
import Regions from "../features/dashboard/pages/Regions";
import Cities from "../features/dashboard/pages/Cities";
import OpenRoute from "./OpenRoute";
import Organizer from "../features/dashboard/pages/Organizer";
import Facilities from "../features/dashboard/pages/Facilities";
import VenueComponent from "../features/dashboard/pages/Venue";
import Artist from "../features/dashboard/pages/Artist";
import EventComponent from "../features/dashboard/pages/Event";
import ShowsComponent from "../features/dashboard/pages/Shows";
import TicketCategory from "../features/dashboard/pages/TicketCategory";


export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  // 👇 OpenRoute wrap
  // router.tsx
  {
    element: <OpenRoute />, // 👈 children yaha aayenge Outlet ke
    children: [
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },

  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <div className="text-center text-3xl font-bold text-blue-500">
                Welcome to Dashboard
              </div>
            ),
          },
          { path: "organizers", element: <Organizer />},
          { path: "artist", element: <Artist />},
          { path: "events", element: <EventComponent />},
          { path: "shows", element: <ShowsComponent /> }, 
          { path: "ticket-category", element: <TicketCategory/> }, 
        
  
          {
            path: "location",
            children: [
              {
                index: true, // 👈 /dashboard/location
                element: (
                  <div className="text-center text-2xl font-semibold text-green-500">
                    Welcome to Locations
                  </div>
                ),
              },
              { path: "countries", element: <Countries /> },
              { path: "regions", element: <Regions /> }, 
              { path: "cities", element: <Cities /> },  
            ],
          },
          {
            path: "venue",
            children: [
              {
                index: true, // 👈 /dashboard/location
                element:<VenueComponent/>
                ,
              },
              { path: "facilities", element: <Facilities /> },
             
            ],
          },
        ],
      },
    ],
  },
],{basename:"/adminpannel"});
