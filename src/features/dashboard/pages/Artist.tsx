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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  createArtist,
  listAllArtists,
  updateArtist,
} from "../../../services/operations/artistApi";
import {
  clearArtistsError,
  setArtistsError,
  type ArtistResponse,
} from "../../../slices/artistSlice";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function Artist() {
  const dispatch = useAppDispatch();

  const artist = useAppSelector((state) => state.artist.data || []);

  console.log(artist);
  const artistError = useAppSelector((state) => state.artist.error);

  //   console.log(organizer);

  // Fetch countries on component mount

  useEffect(() => {
    dispatch(listAllArtists());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<ArtistResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!artistError?.name,
          helperText: artistError?.name,
          onFocus: () =>
            dispatch(
              setArtistsError({
                ...artistError,
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
          error: !!artistError?.description,
          helperText: artistError?.description,
          onFocus: () =>
            dispatch(
              setArtistsError({
                ...artistError,
                description: undefined,
              })
            ),
        },
      },
   {
  accessorKey: "dateOfBirth",
  header: "Date Of Birth",
  Cell: ({ cell }) => {
    const value = cell.getValue<string>() || "";
    return value ? dayjs(value).format("YYYY-MM-DD") : "Not Provided"; // 👈 display
  },
  Edit: ({ cell, row }) => {
    const initialValue = cell.getValue<string>() || "";

    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
      initialValue ? dayjs(initialValue) : null // 👈 parse normally
    );

    const handleChange = (date: Dayjs | null) => {
      setSelectedDate(date);

      // ✅ Save in YYYY-MM-DD format for backend
      const formatted = date ? date.format("YYYY-MM-DD") : "";
      row._valuesCache["dateOfBirth"] = formatted;
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select DOB"
          value={selectedDate}
          onChange={handleChange}
          format="YYYY-MM-DD" // 👈 input box me bhi YYYY-MM-DD
          slotProps={{
            textField: {
              required: true,
              error: !!artistError?.dateOfBirth,
              helperText: artistError?.description,
              onFocus: () =>
                dispatch(
                  setArtistsError({
                    ...artistError,
                    description: undefined,
                  })
                ),
              size: "small",
            },
          }}
        />
      </LocalizationProvider>
    );
  },
}

,
      {
        accessorKey: "nationality",
        header: "Nationality",
        muiEditTextFieldProps: {
          required: true,
          error: !!artistError?.nationality,
          helperText: artistError?.description,
          onFocus: () =>
            dispatch(
              setArtistsError({
                ...artistError,
                description: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "websiteUrl",
        header: "WebsiteUrl",
        muiEditTextFieldProps: {
          required: true,
          error: !!artistError?.websiteUrl,
          helperText: artistError?.description,
          onFocus: () =>
            dispatch(
              setArtistsError({
                ...artistError,
                description: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "twitterHandle",
        header: "Twitter Handle",
        muiEditTextFieldProps: {
          required: true,
          error: !!artistError?.twitterHandle,
          helperText: artistError?.description,
          onFocus: () =>
            dispatch(
              setArtistsError({
                ...artistError,
                description: undefined,
              })
            ),
        },
      },
    ],
    [dispatch, artistError]
  );

  const handleCreate: MRT_TableOptions<ArtistResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // Include comments in the create data
        const createData = {
          ...values,
        };

        console.log(values)

        const result = await (dispatch(
          createArtist(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          dispatch(setArtistsError(null));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
        // Reset comments after successful creation
      } catch (error) {
        console.error("Error creating country:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<ArtistResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        const result = await (dispatch(
          updateArtist({ id: row.original.id, formData: values })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(clearArtistsError());
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
    data: artist,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setArtistsError(null));
    },
    onEditingRowCancel: () => {
      dispatch(setArtistsError(null));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Artist</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index != 7)}

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
        <DialogTitle>Edit Artist</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index != 7)}
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
          Add New Artist
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
