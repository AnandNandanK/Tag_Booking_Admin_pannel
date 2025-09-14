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


import { createFacilities, listAllFacilities, updateFacilities, updateFacilityStatus } from "../../../services/operations/venue/facilities";
import { clearFacilitiesError, setFacilitiesError, type FacilitiesResponse,} from "../../../slices/venue/facilitiesSlice";


export default function Facilities() {
  const dispatch = useAppDispatch();

  const facilities = useAppSelector((state) => state.facilities.data || []);

  console.log(facilities)
  const FacilitiesError = useAppSelector((state) => state.facilities.error);
  console.log(FacilitiesError);

  //   console.log(organizer);

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(listAllFacilities());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<FacilitiesResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!FacilitiesError?.name,
          helperText: FacilitiesError?.name,
          onFocus: () =>
            dispatch(
              setFacilitiesError({
                ...FacilitiesError,
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
          error: !!FacilitiesError?.description,
          helperText: FacilitiesError?.description,
          onFocus: () =>
            dispatch(
              setFacilitiesError({
                ...FacilitiesError,
                description: undefined,
              })
            ),
        },
      },
     
      {
        accessorKey: "active",
        header: "Active",
        muiEditTextFieldProps: {
          required: true,
          error: !!FacilitiesError?.active,
          helperText: FacilitiesError?.active,
          onFocus: () =>
            dispatch(
              setFacilitiesError({
                ...FacilitiesError,
                active: undefined,
              })
            ),
        },

       
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
                  updateFacilityStatus({ id: row.original.facilityId, active: newValue })
                );
              }}
              color="primary"
            />
          );
        },
      },
    ],
    [dispatch, FacilitiesError]
  );

  const handleCreate: MRT_TableOptions<FacilitiesResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        // Include comments in the create data
        const createData = {
          ...values,
        };

        const result = await (dispatch(
          createFacilities(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          dispatch(setFacilitiesError(null));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
        // Reset comments after successful creation
      } catch (error) {
        console.error("Error creating country:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<FacilitiesResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        const result = await (dispatch(
          updateFacilities({ id: row.original.facilityId, formData: values })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(clearFacilitiesError());
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
    data: facilities,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.facilityId.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setFacilitiesError(null));
    },
    onEditingRowCancel: () => {
      dispatch(setFacilitiesError(null));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}

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
        <DialogTitle>Edit Facility</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index !== 2)}
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
          Add New Facility
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
