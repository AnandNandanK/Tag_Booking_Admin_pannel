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
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  setTicketCategoriesError,
  type TicketCategory,
} from "../../../slices/ticketCategorySlice";
import {
  listAllShows,
  listAllShowsByEvent,
  updateShow,
} from "../../../services/operations/showApi";

import "react-datepicker/dist/react-datepicker.css";
import {
  createTicketCategory,
  listAllTicketCategories,
  updateTicketCategory,
} from "../../../services/operations/ticketCategoryApi";
import { listAllEvents } from "../../../services/operations/eventApi";

export default function TicketCategory() {
  const dispatch = useAppDispatch();

  const category = useAppSelector((state) => state.ticketCategory.data || []);
  const events = useAppSelector((state) => state.event.data || []);
  //   console.log(category);

  //   console.log(category);
  const showsError = useAppSelector((state) => state.shows.error);
  const [showId, setShowId] = useState<number>(0);

  //   console.log(organizer);

  // Fetch countries on component mount

  useEffect(() => {
    dispatch(listAllTicketCategories());
    dispatch(listAllShows());
    dispatch(listAllEvents());
  }, [dispatch]);

  //   console.log(shows);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<TicketCategory>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "price",
        header: "Price",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.startTime,
          helperText: showsError?.startTime,
          onFocus: () =>
            dispatch(
              setTicketCategoriesError({
                ...showsError,
                price: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "capacity",
        header: "Capacity",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.endTime,
          helperText: showsError?.endTime,
          onFocus: () =>
            dispatch(
              setTicketCategoriesError({
                ...showsError,
                capacity: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "description",
        header: "Description",
        muiEditTextFieldProps: {
          required: true,
          error: !!showsError?.showDate,
          helperText: showsError?.showDate,
          onFocus: () =>
            dispatch(
              setTicketCategoriesError({
                ...showsError,
                description: undefined,
              })
            ),
        },
      },
     {
  accessorKey: "showId",
  header: "Show",

  Edit: ({ cell, row }) => {
    const events = useAppSelector((state) => state.event.data || []);
    const shows = useAppSelector((state) => state.shows.data || []);

    const dispatch = useAppDispatch();

    // row se showId nikal lo
    const initialShowId = row.original.showId || "";
    const initialShow = shows.find((s) => s.showId === initialShowId);

    // agar show mila hai to uska eventId lo, warna empty
    const initialEventId = initialShow?.eventId || "";

    const [selectedEventId, setSelectedEventId] = React.useState<
      number | ""
    >(initialEventId);
    const [selectedShowId, setSelectedShowId] = React.useState<
      number | ""
    >(initialShowId);

    const selectedShow = shows.find((s) => s.showId === selectedShowId);

    // Event change handler
    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const eventId = Number(e.target.value);
      setSelectedEventId(eventId);
      setSelectedShowId(""); // reset show when event changes
      dispatch(listAllShowsByEvent(eventId));
    };

    // Show change handler
    const handleShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setSelectedShowId(value);
      setShowId(value);
    };

    // Agar pehle se eventId set hai to uske shows fetch kara lo (ek bar hi)
    React.useEffect(() => {
      if (initialEventId) {
        dispatch(listAllShowsByEvent(initialEventId));
      }
    }, [initialEventId, dispatch]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Event Selector */}
        <TextField
          select
          label="Select Event"
          value={selectedEventId}
          onChange={handleEventChange}
          size="small"
        >
          {events.map((event) => (
            <MenuItem key={event.eventId} value={event.eventId}>
              {event.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Show Selector */}
        {selectedEventId && (
          <>
            {!shows.length ? (
              <p>Loading shows...</p>
            ) : (
              <TextField
                select
                label="Select Show"
                value={selectedShowId}
                onChange={handleShowChange}
                size="small"
              >
                {shows.map((show) => (
                  <MenuItem key={show.showId} value={show.showId}>
                    <Typography variant="body2">
                      <strong>SHOW ID:</strong> {show.showId}{" "}
                      <strong>DATE:</strong> {show.showDate}{" "}
                      <strong>VENUE:</strong> {show.venueName}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}
          </>
        )}

        {/* Conditional UI */}
        {selectedShow?.bookingType === "SEAT_BASED" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <label style={{ fontSize: "14px", fontWeight: 500 }}>
              Enter Layout Data
            </label>

            <TextField label="Rows" type="number" size="small" />
            <TextField label="Seats per Row" type="number" size="small" />
            <TextField
              label="Row Labels (comma separated)"
              type="text"
              size="small"
            />
          </div>
        )}

        {selectedShow?.bookingType === "GENERAL_ADMISSION" && (
          <p
            style={{
              fontSize: "14px",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            General Admission – No extra layout needed
          </p>
        )}
      </div>
    );
  },
},


      {
        accessorKey: "categoryId",
        header: "categor Id",
      },

      {
        accessorKey: "available",
        header: "Available",
      },
    ],
    [dispatch, showsError]
  );

  const handleCreate: MRT_TableOptions<TicketCategory>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // ✅ Convert values to proper types
        const formData = {
          name: values.name as string,
          price: Number(values.price),
          capacity: Number(values.capacity),
          description: values.description as string,
          layout: {
            rows: Number(values.layout?.rows),
            seatsPerRow: Number(values.layout?.seatsPerRow),
            rowLabels: (values.layout?.rowLabels as string)
              ?.split(",") // "A,B,C" → ["A","B","C"]
              .map((label: string) => label.trim())
              .filter((label: string) => label.length > 0),
          },
        };

        console.log(formData);

        console.log("Final Ticket Category Payload:", formData);

        const result = await (dispatch(
          createTicketCategory({ formData, showId })
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Create Result:", result);

        if (result.success) {
          dispatch(setTicketCategoriesError({}));
          table.setCreatingRow(null); // ✅ close modal only if success
        }
      } catch (error) {
        console.error("Error creating ticket category:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<TicketCategory>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        // ✅ Convert values to proper types
        const formData = {
          name: values.name as string,
          price: Number(values.price),
          capacity: Number(values.capacity),
          description: values.description as string,
          layout: {
            rows: Number(values.layout?.rows),
            seatsPerRow: Number(values.layout?.seatsPerRow),
            rowLabels: (values.layout?.rowLabels as string)
              ?.split(",") // "A,B,C" → ["A","B","C"]
              .map((label: string) => label.trim())
              .filter((label: string) => label.length > 0),
          },
        };

        const result = await (dispatch(
          updateTicketCategory({ id: row.original.categoryId, formData })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(setTicketCategoriesError({}));
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
    data: category,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.categoryId.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setTicketCategoriesError({}));
    },
    onEditingRowCancel: () => {
      dispatch(setTicketCategoriesError({}));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Ticket Category</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 5)}

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
        <DialogTitle>Edit Ticket Category</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 5)}
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
          Add New Ticket Category
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
