src/
│── assets/            # Images, fonts, global styles
│── components/        # Reusable UI components (Buttons, Modals, Navbar, etc.)
│── features/          # Feature-based components (Auth, Dashboard, Profile, etc.)
│   └── auth/
│       ├── components/
│       ├── pages/
│       └── authSlice.ts
│── hooks/             # Custom hooks (useAuth, useFetch, etc.)
│── layouts/           # Page layouts (MainLayout, AuthLayout, etc.)
│── pages/             # Route pages (Home, About, Contact, etc.)
│── services/          # API calls (axios, fetch wrappers)
│── store/             # Redux or Zustand store
│── utils/             # Helper functions (formatDate, validators, etc.)
│── App.tsx
│── main.tsx


src/
│── features/
│   └── auth/
│       ├── components/      # Small UI parts (Input, PasswordField, etc.)
│       ├── pages/           # Full pages
│       │   ├── Login.tsx
│       │   └── Signup.tsx
│       └── authSlice.ts     # Redux slice / state for auth







// import { FiPlus } from "react-icons/fi";
// import { DataGrid, type GridColDef } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../../store/hooks";
// import { getAllCountries } from "../../../services/operations/location/country";
// import CreateCountry from "../components/CreateCountry";
// import Button from "@mui/material/Button";
// import UpdateCountry from "../components/updateCountry";

// export default function Countries() {
//   const dispatch = useAppDispatch();
//   const countryData = useAppSelector((state) => state.country.data);
//   const [open, setOpen] = useState(false);
//   const [editOpen,setEditOpen]=useState(false);
//   const [editCountryId, setEditCountryId] = useState<number | null>(null);

//   // ✅ Columns with Edit button
//   const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", flex: 1 },
//   { field: "name", headerName: "Country Name", flex: 1 },
//   { field: "code", headerName: "Code", flex: 1 },
//   { field: "phoneCode", headerName: "Phone Code", flex: 1 },
//   { field: "active", headerName: "Active", flex: 1, type: "boolean" },
//   {
//     field: "actions",
//     headerName: "Actions",
//     flex: 1,
//     renderCell: (params) => (
//       <Button
//         variant="contained"
//         color="primary"
//         size="small"
//         onClick={() => handleEdit(params.row.id)}
//       >
//         Edit
//       </Button>
//     ),
//   },
// ];

//   const rows = countryData?.content || []; // PageData<Country>.content
//   const paginationModel = { page: 0, pageSize: 5 };

//   useEffect(() => {
//     dispatch(getAllCountries());
//   }, [dispatch]);

//   const handleEdit = (id: number) => {
//     console.log("Edit country id:", id);
//     setEditCountryId(id);
//     setEditOpen(true);
//   };

//   // console.log(countryData?.content);

//   return (
//     <div className="w-full overflow-x-auto relative">
//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-[90%]">
//             <CreateCountry setOpen={setOpen} />
//           </div>
//         </div>
//       )}

//       {editOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-[90%]">
//             <UpdateCountry setEditOpen={setEditOpen} editCountryId={editCountryId} />
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex w-full flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4 md:gap-0">
//         <div className="text-2xl text-blue-500 font-bold">Countries</div>
//         <div className="flex flex-col md:flex-row gap-2 md:gap-3">
//           <button
//             onClick={() => {
//               setEditCountryId(null); // Create new country
//               setOpen(true);
//             }}
//             className="bg-green-500 text-white text-lg p-2 rounded-sm flex items-center gap-1 font-semibold justify-center"
//           >
//             Create Countries <FiPlus size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <Paper sx={{ height: 400, width: "100%" }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             initialState={{ pagination: { paginationModel } }}
//             pageSizeOptions={[5, 10]}
//             sx={{ border: 0 }}
//           />
//         </Paper>
//       </div>
//     </div>
//   );
// }




sushil rawat
11:18 AM
{
  "cityId": 1,
  "genres": ["CONCERT", "DRAMA"],
  "languages": ["English", "Hindi", "Bengali"],
  "datePresets": ["TODAY", "TOMORROW", "WEEKEND"],
  "venueIds": [5, 7],
  "priceGroups": [
    { "min": 0, "max": 500 },
    { "min": 501, "max": 2000 }
  ],
  "startDate": null,
  "endDate": null
}
zrg-ksjr-tdo