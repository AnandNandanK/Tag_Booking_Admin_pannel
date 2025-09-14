import { useMemo, useEffect } from "react";
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
  Switch,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  createOrganizers,
  listAllOrganizers,
  updateOrganiserStatus,
  updateOrganizers,
} from "../../../services/operations/organizerApi";
import {
  clearOrganizerError,
  setOrganizerError,
  type organizerResponse,
} from "../../../slices/organizerSlice";

export default function Organizer() {
  const dispatch = useAppDispatch();

  const organizer = useAppSelector((state) => state.organizer.data || []);
  console.log(organizer)
  const organizerError = useAppSelector((state) => state.organizer.error);
  console.log(organizerError);

  //   console.log(organizer);

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(listAllOrganizers());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<organizerResponse>[]>(
    () => [
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
        accessorKey: "contactEmail",
        header: "Contact Email",
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
        accessorKey: "contactPhone",
        header: "Contact Phone",
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
        accessorKey: "conatctPerson",
        header: "Contact Person",
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
        accessorKey: "websiteUrl",
        header: "Website Url",
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
        accessorKey: "active",
        header: "Active",
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
        enableEditing: (row) => !row.original?.id, // Only enable for create
        editVariant: "select",
        editSelectOptions: [
          { value: true, label: "True" },
          { value: false, label: "False" },
        ],

        Cell: ({ row }) => {
          const isActive = row.original.active;
          return (
            <Switch
              checked={isActive}
              onChange={(e) => {
                const newValue = e.target.checked;
                dispatch(
                  updateOrganiserStatus({ organiserId: row.original.id, active: newValue })
                );
              }}
              color="primary"
            />
          );
        },
      },
    ],
    [dispatch, organizerError]
  );



  const handleCreate: MRT_TableOptions<organizerResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // Include comments in the create data
        const createData = {
          ...values,
        };
        console.log(values);

        const result = await (dispatch(
          createOrganizers(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          dispatch(setOrganizerError(null));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
        // Reset comments after successful creation
      } catch (error) {
        console.error("Error creating country:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<organizerResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        const result = await (dispatch(
          updateOrganizers({ id: row.original.id, formData: values })
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
    data: organizer,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
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
        <DialogTitle>Add New Organizer</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index !== 6)}

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
        <DialogTitle>Edit Organiser</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index !== 6)}
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
          Add New Organiser
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
