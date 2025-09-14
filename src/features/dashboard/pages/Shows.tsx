import React, { useMemo, useEffect } from "react";
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
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import { setShowError, type ShowResponse } from "../../../slices/showSlice";
import {
  createShow,
  listAllShows,
  updateShow,
  updateShowStatus,
} from "../../../services/operations/showApi";
import { listAllVenues } from "../../../services/operations/venue/venueApi";
import { listAllEvents } from "../../../services/operations/eventApi";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ShowsComponent() {
  const dispatch = useAppDispatch();

  const shows = useAppSelector((state) => state.shows.data || []);

  console.log(shows);
  const showsError = useAppSelector((state) => state.shows.error);

  //   console.log(organizer);

  // Fetch countries on component mount

  useEffect(() => {
    dispatch(listAllShows());
    dispatch(listAllVenues());
    dispatch(listAllEvents());
  }, [dispatch]);

  console.log(shows);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<ShowResponse>[]>(
    () => [
      {
        accessorKey: "venueId",
        header: "Venue Id",

        Edit: ({ cell, row }) => {
          // Redux se organisers list lao
          const venues = useAppSelector(
            (state) => state.venues.venues?.content || []
          );

          // Initial value -> pehle se saved ID agar hai
          const initialValue = Number(cell.getValue<number>()) || "";
          const [selected, setSelected] = React.useState<number | "">(
            initialValue
          );

          const handleChange = (event: any) => {
            const value = event.target.value;
            setSelected(value);

            // row me save karo (single value)
            row._valuesCache["venueId"] = value;
          };

          return (
            <Select
              value={selected}
              onChange={handleChange}
              displayEmpty
              fullWidth
              renderValue={(selectedId) => {
                if (!selectedId) {
                  return <em>Select Venue</em>;
                }
                const venue = venues.find(
                  (o) => o.venueId === Number(selectedId)
                );
                return venue ? venue.name : "";
              }}
            >
              {venues.map((venue) => (
                <MenuItem key={venue.venueId} value={Number(venue.venueId)}>
                  {venue.name}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },

      {
        accessorKey: "eventId",
        header: "Event Id",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.eventId,
          helperText: showsError?.eventId,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                eventId: undefined,
              })
            ),
        },

        Edit: ({ cell, row }) => {
          // Redux se organisers list lao
          const events = useAppSelector((state) => state.event.data || []);

          // Initial value -> pehle se saved ID agar hai
          const initialValue = Number(cell.getValue<number>()) || "";
          const [selected, setSelected] = React.useState<number | "">(
            initialValue
          );

          const handleChange = (event: any) => {
            const value = event.target.value;
            setSelected(value);

            // row me save karo (single value)
            row._valuesCache["eventId"] = value;
          };

          return (
            <Select
              value={selected}
              onChange={handleChange}
              displayEmpty
              fullWidth
              renderValue={(selectedId) => {
                if (!selectedId) {
                  return <em>Select Event</em>;
                }
                const event = events.find(
                  (o) => o.eventId === Number(o.eventId)
                );
                return event ? event.name : "";
              }}
            >
              {events.map((event) => (
                <MenuItem key={event.eventId} value={Number(event.eventId)}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },

      {
        accessorKey: "showDate",
        header: "Show Date",
        // Normal textfield ke badle Edit render kar rahe hain
        Edit: ({ cell, row }) => {
          const initialValue = cell.getValue<string>() || "";

          // Convert string ("2025-10-15") → Date object
          const [selectedDate, setSelectedDate] = React.useState<Date | null>(
            initialValue ? new Date(initialValue) : null
          );

          const handleChange = (date: Date | null) => {
            setSelectedDate(date);

            // ✅ Format to YYYY-MM-DD
            const formatted = date ? date.toISOString().split("T")[0] : "";

            // save in row cache
            row._valuesCache["showDate"] = formatted;
          };

          return (
            <DatePicker
              selected={selectedDate}
              onChange={handleChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="border rounded px-2 py-1 w-full"
            />
          );
        },
      },

      {
        accessorKey: "startTime",
        header: "Start Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.startTime,
          helperText: showsError?.startTime,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                startTime: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.endTime,
          helperText: showsError?.endTime,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                endTime: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "basePrice",
        header: "Base Price",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.basePrice,
          helperText: showsError?.basePrice,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                basePrice: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "showId",
        header: "Show Id",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.showDate,
          helperText: showsError?.showDate,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                showDate: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "venueName",
        header: "Venue Name",

        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.bookingType,
          helperText: showsError?.bookingType,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                bookingType: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "eventName",
        header: "Event Name",

        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.bookingType,
          helperText: showsError?.bookingType,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                bookingType: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "bookingType",
        header: "Booking Type",

        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.bookingType,
          helperText: showsError?.bookingType,
          onFocus: () =>
            dispatch(
              setShowError({
                ...showsError,
                bookingType: undefined,
              })
            ),
        },
        Edit: ({ cell, row }) => {
          // Initial value (agar pehle se koi value hai)
          const initialValue = cell.getValue<string>() || "";
          const [selected, setSelected] = React.useState<string>(initialValue);

          const handleChange = (event: any) => {
            const value = event.target.value;
            setSelected(value);

            // row me store karo
            row._valuesCache["bookingType"] = value;
          };

          return (
            <Select
              value={selected}
              onChange={handleChange}
              displayEmpty
              fullWidth
              renderValue={(selectedValue) => {
                if (!selectedValue) {
                  return <em>Select Booking Type</em>;
                }
                switch (selectedValue) {
                  case "CATEGORY_BASED":
                    return "CATEGORY_BASED";
                  case "SEAT_BASED":
                    return "SEAT_BASED";
                  case "GENERAL_ADMISSION":
                    return "GENERAL_ADMISSION";
                  default:
                    return selectedValue;
                }
              }}
            >
              <MenuItem value="CATEGORY_BASED">CATEGORY_BASED</MenuItem>
              <MenuItem value="SEAT_BASED">SEAT_BASED</MenuItem>
              <MenuItem value="GENERAL_ADMISSION">GENERAL_ADMISSION</MenuItem>
            </Select>
          );
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        enableEditing: false,

        Cell: ({ row }) => {
          const status = row.original.status ?? "";

          return (
            <Select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as
                  | "SCHEDULED"
                  | "ONGOING"
                  | "COMPLETED"
                  | "CANCELLED"
                  | "POSTPONED";
                dispatch(
                  updateShowStatus({
                    id: row.original.showId,
                    status: newStatus,
                  })
                );
              }}
              size="small"
              fullWidth
            >
              <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
              <MenuItem value="ONGOING">ONGOING</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED </MenuItem>
              <MenuItem value="POSTPONED">POSTPONED</MenuItem>
            </Select>
          );
        },
      },
    ],
    [dispatch, showsError]
  );

  const handleCreate: MRT_TableOptions<ShowResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // Convert values to proper types
        const createData = {
          eventId: Number(values.eventId),
          venueId: Number(values.venueId),
          showDate: values.showDate, // "YYYY-MM-DD"
          startTime: values.startTime, // "HH:mm:ss"
          endTime: values.endTime, // "HH:mm:ss"
          basePrice: Number(values.basePrice),
          bookingType: values.bookingType, // "CATEGORY_BASED" | "NORMAL_BASED"
        };

        console.log("Final Payload:", createData);

        const result = await (dispatch(
          createShow(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Create Result:", result);

        if (result.success) {
          dispatch(setShowError({}));
          table.setCreatingRow(null); // ✅ close modal only if success
        }
      } catch (error) {
        console.error("Error creating show:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<ShowResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        const result = await (dispatch(
          updateShow({ id: row.original.venueId, formData: values })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(setShowError({}));
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
    data: shows,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.showId.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setShowError({}));
    },
    onEditingRowCancel: () => {
      dispatch(setShowError({}));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Show</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter(
            (_, index) => index !== 8 && index !== 6 && index !== 10
          )}

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
        <DialogTitle>Edit Show</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 7)}
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
          Add New Show
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
