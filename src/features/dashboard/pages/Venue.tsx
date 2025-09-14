import React, { useMemo, useEffect, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  clearOrganizerError,
  setOrganizerError,
} from "../../../slices/organizerSlice";

import {
  createVenues,
  listAllVenues,
  updateVenues,
  updateVenueStatus,
  type VenueRequest,
} from "../../../services/operations/venue/venueApi";
import type { VenueResponse } from "../../../interfaces/venueInterFace";
import { listAllCities } from "../../../services/operations/location/citiesApi";
import { listAllFacilities } from "../../../services/operations/venue/facilities";

const EVENT_OPTIONS = [
  "CONCERT",
  "MOVIE",
  "SPORTS",
  "THEATER",
  "EXHIBITION",
  "CLUB_NIGHT",
  "CONFERENCE",
];

type ImageData = {
  imageUrl: string;
  caption: string;
  displayOrder: string;
};

export default function VenueComponent() {
  const dispatch = useAppDispatch();
  const venues = useAppSelector((state) => state.venues.venues?.content || []);
  const facilities = useAppSelector((state) => state.facilities.data || []);
  const cities = useAppSelector((state) => state.city.data?.content || []);
  const [cityId, setCityId] = useState<number>();
  // console.log(facilities);
  // console.log(venues);
  const organizerError = useAppSelector((state) => state.organizer.error);
  // console.log(organizerError);

  //   console.log(organizer);

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(listAllVenues());
    dispatch(listAllCities());
    dispatch(listAllFacilities());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<VenueResponse>[]>(
    () => [
      {
        accessorKey: "city",
        header: "City",
        // ✅ Dropdown ke options
        editSelectOptions: cities.map((city) => ({
          value: city.id, // jo value backend me store hogi
          label: city.name, // jo dropdown me dikhega
        })),

        muiEditTextFieldProps: {
          select: true, // ✅ isse confirm ho jayega ki select hi render ho
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),

          onChange: (event) => {
            const selectedCityId = Number(event.target.value);
            setCityId(selectedCityId);
          },
        },

        Cell: ({ row }) => row.original.city?.label || "N/A",
      },

      {
        accessorKey: "name",
        header: "Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.name,
          helperText: organizerError?.name,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                name: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "address",
        header: "Address",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.name,
          helperText: organizerError?.name,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                name: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.description,
          helperText: organizerError?.description,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                description: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "pincode",
        header: "Pincode",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.contactEmail,
          helperText: organizerError?.contactEmail,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                contactEmail: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "latitude",
        header: "Latitude",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.contactPhone,
          helperText: organizerError?.contactPhone,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                contactPhone: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "longitude",
        header: "Longitude",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.contactPerson,
          helperText: organizerError?.contactPerson,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                contactPerson: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "venueType",
        header: "Venue Type",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "totalCapacity",
        header: "Total Capacity",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Number",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "prohibitedItemsImageUrl",
        header: "Prohibited Items ImageUrl",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "layoutSchemaImageUrl",
        header: "Layout Schema ImageUrl",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "supportedEvents",
        header: "Supported Events",
        Cell: ({ row }) => row.original.supportedEvents?.join(", ") || "",

        Edit: ({ cell, row }) => {
          const initialValue = cell.getValue<string[]>() || [];
          const [selectedEvents, setSelectedEvents] =
            useState<string[]>(initialValue);

          const toggleEvent = (event: string) => {
            let newValue: string[];
            if (selectedEvents.includes(event)) {
              // Agar already selected hai, remove kar do
              newValue = selectedEvents.filter((e) => e !== event);
            } else {
              // Nahi hai to add kar do
              newValue = [...selectedEvents, event];
            }

            setSelectedEvents(newValue);
            // Table me bhi update karo
            row._valuesCache["supportedEvents"] = newValue;
          };

          return (
            <div className="p-2 w-96">
              <label className="block text-sm font-medium mb-2">
                Supported Events
              </label>
              <div className="flex flex-col gap-1">
                {EVENT_OPTIONS.map((event) => (
                  <label key={event} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event)}
                      onChange={() => toggleEvent(event)}
                    />
                    <span>{event}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "images",
        header: "Images",

        Cell: ({ row }) => {
          const images = row.original.images;
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <div>
              {/* Label button */}
              <Button variant="outlined" size="small" onClick={handleOpen}>
                Image Details
              </Button>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {images?.map((img) => (
                  <MenuItem key={img.id} onClick={handleClose}>
                    <div>
                      <Typography variant="body2">
                        <strong>URL:</strong> {img.imageUrl}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Caption:</strong> {img.caption ?? "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Display Order:</strong> {img.displayOrder}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        },

        Edit: ({ cell, row }) => {
          const [images, setImages] = useState<ImageData[]>(
            cell.getValue<ImageData[]>() || []
          );

          const [form, setForm] = useState({
            imageUrl: "",
            caption: "",
            displayOrder: "",
          });

          const handleChange = (field: string, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
          };

          const updateImages = (newImages: ImageData[]) => {
            setImages(newImages);

            if ("setValue" in cell) {
              (cell as any).setValue(newImages);
            } else {
              row._valuesCache["images"] = newImages;
            }
          };

          const handleAdd = () => {
            if (!form.imageUrl) return; // Image URL mandatory
            const newImages = [...images, { ...form }];
            updateImages(newImages);
            setForm({ imageUrl: "", caption: "", displayOrder: "" });
          };

          const handleDelete = (index: number) => {
            const newImages = images.filter((_, i) => i !== index);
            updateImages(newImages);
          };

          return (
            <div className="p-3 border border-gray-400 rounded flex flex-col gap-2 ">
              <p className="w-full text-center font-bold text-blue-500">
                Add Images
              </p>

              <input
                type="text"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Caption"
                value={form.caption}
                onChange={(e) => handleChange("caption", e.target.value)}
                className="border p-1 rounded"
              />
              <input
                type="number"
                placeholder="Display Order"
                value={form.displayOrder}
                onChange={(e) => handleChange("displayOrder", e.target.value)}
                className="border p-1 rounded"
              />

              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                + Add Image
              </button>

              <div>
                <strong>Added Images:</strong>
                <ul className="list-disc pl-4 space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>
                        {img.imageUrl} | {img.caption} | {img.displayOrder}
                      </span>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="bg-red-500 text-white px-2 py-0.5 rounded ml-2"
                      >
                        Clear
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "facilities",
        header: "Facilities",
        Cell: ({ row }) => {
          const Facilities = row.original.facilities;
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <div>
              {/* Label button */}
              <Button variant="outlined" size="small" onClick={handleOpen}>
                Facility Details
              </Button>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {Facilities?.map((facility) => (
                  <MenuItem key={facility.facilityId} onClick={handleClose}>
                    <div>
                      <Typography variant="body2">
                        <strong>Name:</strong> {facility.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Discription:</strong>{" "}
                        {facility.description ?? "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Active:</strong> {facility.active}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        },

        Edit: ({ cell, row }) => {
          console.log(cell);
          const initialValue = Array.isArray(row.original.facilities)
            ? row.original.facilities.map((f) => f.facilityId)
            : [];

          const [selected, setSelected] = useState<number[]>(initialValue);
          const [open, setOpen] = useState(false);

          const handleChange = (facilityId: number) => {
            let newSelected = [...selected];
            if (selected.includes(facilityId)) {
              newSelected = newSelected.filter((id) => id !== facilityId);
            } else {
              newSelected.push(facilityId);
            }
            setSelected(newSelected);
            row._valuesCache["facilityIds"] = newSelected;
          };

          return (
            <div className="relative inline-block w-full">
              {/* Button to open dropdown */}
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-sm hover:bg-gray-100 transition"
                onClick={() => setOpen(!open)}
              >
                {selected.length > 0
                  ? facilities
                      .filter((f) => selected.includes(f.facilityId))
                      .map((f) => f.name)
                      .join(", ")
                  : "Select Facility"}
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {facilities.map((facility) => (
                    <label
                      key={facility.facilityId}
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        checked={selected.includes(facility.facilityId)}
                        onChange={() => handleChange(facility.facilityId)}
                      />
                      <span className="text-sm">{facility.name}</span>
                    </label>
                  ))}

                  {/* Close button */}
                  <div className="p-2 border-t border-gray-200 text-right">
                    <button
                      className="px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        },
      },

      {
        accessorKey: "region",
        header: "Region",
        Cell: ({ row }) => row.original.region?.label || "N/A",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        Cell: ({ row }) => row.original.country?.label || "N/A",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.websiteUrl,
          helperText: organizerError?.websiteUrl,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                websiteUrl: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        muiEditTextFieldProps: {
          required: true,
          error: !!organizerError?.active,
          helperText: organizerError?.active,
          onFocus: () =>
            dispatch(
              setOrganizerError({
                ...organizerError,
                active: undefined,
              })
            ),
        },
        enableEditing: (row) => !row.original?.venueId, // Only enable for create
        editVariant: "select",
        editSelectOptions: [
          { value: true, label: "ACTIVE" },
          { value: false, label: "INACTIVE" },
        ],

        Cell: ({ row }) => {
          const status = row.original.status as
            | "ACTIVE"
            | "INACTIVE"
            | "UNDER_MAINTENANCE"
            | "CLOSED"
            | null;

          return (
            <Select
              value={status ?? ""} // null ho to empty string
              onChange={(e) => {
                const newStatus = e.target.value as
                  | "ACTIVE"
                  | "INACTIVE"
                  | "UNDER_MAINTENANCE"
                  | "CLOSED";

                dispatch(
                  updateVenueStatus({
                    id: row.original.venueId,
                    active: newStatus, // string jaayegi API me
                  })
                );
              }}
              size="small"
              fullWidth
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              <MenuItem value="UNDER_MAINTENANCE">UNDER MAINTENANCE</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
            </Select>
          );
        },
      },
    ],
    [dispatch, organizerError, facilities, cities]
  );

  const handleCreate: MRT_TableOptions<VenueResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // ✅ Only pick required fields for VenueRequest
        const createData: VenueRequest = {
          name: values.name,
          address: values.address,
          description: values.description,
          cityId: cityId ?? 0, // ensure correct cityId
          pincode: values.pincode,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          venueType: values.venueType.toUpperCase(),
          totalCapacity: Number(values.totalCapacity),
          contactNumber: values.contactNumber,
          email: values.email,
          prohibitedItemsImageUrl: values.prohibitedItemsImageUrl,
          layoutSchemaImageUrl: values.layoutSchemaImageUrl,
          supportedEvents: values.supportedEvents, // ensure valid enum values
          images: values.images,
          facilityIds: values.facilityIds,
        };

        const result = await (dispatch(
          createVenues(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Result:", result);

        if (result.success) {
          dispatch(setOrganizerError(null));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
      } catch (error) {
        console.error("Error creating venue:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<VenueResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        // ✅ Only pick required fields for VenueRequest
        const formData: VenueRequest = {
          name: values.name,
          address: values.address,
          description: values.description,
          cityId: cityId ?? 0, // ensure correct cityId
          pincode: values.pincode,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          venueType: values.venueType.toUpperCase(),
          totalCapacity: Number(values.totalCapacity),
          contactNumber: values.contactNumber,
          email: values.email,
          prohibitedItemsImageUrl: values.prohibitedItemsImageUrl,
          layoutSchemaImageUrl: values.layoutSchemaImageUrl,
          supportedEvents: values.supportedEvents, // ensure valid enum values
          images: values.images,
          facilityIds: values.facilityIds,
        };

        const result = await (dispatch(
          updateVenues({ formData, id: row.original.venueId })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(clearOrganizerError());
        }
      } catch (error) {
        console.error("Error updating country:", error);
      }
    };

  // Export function
  const handleExportCSV = () => {
    const rowModel = table.getFilteredRowModel().rows;

    if (!rowModel.length) return;

    // Column headers (excluding actions column)
    const headers = table
      .getAllLeafColumns()
      .filter((col) => col.id !== "mrt-row-actions") // Exclude actions column
      .map((col) => col.columnDef.header)
      .join(",");

    // Row data
    const csvRows = rowModel.map((row) =>
      row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== "mrt-row-actions") // Exclude actions
        .map((cell) => {
          const value = cell.getValue();
          // Handle boolean values for active field
          if (typeof value === "boolean") {
            return value ? "Active" : "Inactive";
          }
          return value || "";
        })
        .join(",")
    );

    const csvString = [headers, ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "countries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Table setup
  const table = useMaterialReactTable({
    columns,
    data: venues,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.venueId.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setOrganizerError(null));
    },
    onEditingRowCancel: () => {
      dispatch(setOrganizerError(null));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Venue</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 16)}

          {/* Custom comments field - only appears in create dialog */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons table={table} row={row} />
        </DialogActions>
      </>
    ),

    // Edit dialog - NO comments field here
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit Country</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 16)}
          {/* Skip active field */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
          Add New Venue
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
