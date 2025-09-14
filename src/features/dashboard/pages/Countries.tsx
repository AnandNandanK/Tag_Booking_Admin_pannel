import { useMemo, useEffect, useState } from "react";
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
  CreateCountries,
  getAllCountries,
  UpdateCountries,
  updateCountryStatus,
} from "../../../services/operations/location/country";
import type { AppDispatch } from "../../../store/store";
import { setCountryError } from "../../../slices/locations/countrySlice";

// --- Type define
type Country = {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  active: boolean;
  comments?: string;
};

export default function CountriesTable() {
  const dispatch = useAppDispatch();
  const countries = useAppSelector( (state) => state.country.data?.content || []
  );
  const countryError = useAppSelector((state) => state.country.error);

  // State for comments field (only used in create dialog)
  const [comments, setComments] = useState("");

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Country Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!countryError?.name,
          helperText: countryError?.name,
          onFocus: () =>
           dispatch( setCountryError({
              ...countryError,
              name: undefined,
            })),
        },
      },
      {
        accessorKey: "code",
        header: "Code",
        muiEditTextFieldProps: {
          required: true,
          error: !!countryError?.code,
          helperText: countryError?.code,
          onFocus: () =>
            dispatch(setCountryError({
              ...countryError,
              code: undefined,
            })),
        },
      },
      {
        accessorKey: "phoneCode",
        header: "Phone Code",
        muiEditTextFieldProps: {
          required: true,
          error: !!countryError?.phoneCode,
          helperText: countryError?.phoneCode,
          onFocus: () =>
            dispatch(setCountryError({
              ...countryError,
              phoneCode: undefined,
            })),
        },
      },

      {
        accessorKey: "active",
        header: "Active",
        muiEditTextFieldProps: {
          required: true,
          error: !!countryError?.active,
          helperText: countryError?.active,
          onFocus: () =>
            dispatch(setCountryError({
              ...countryError,
              active: undefined,
            })),
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
                  updateCountryStatus({ id: row.original.id, active: newValue })
                );
              }}
              color="primary"
            />
          );
        },
      },
    ],
    [dispatch, countryError]
  );

  const handleCreate: MRT_TableOptions<Country>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    try {
      // Include comments in the create data
      const createData = {
        ...values,
        comments: comments.trim() || undefined, // Only include if not empty
      };

      const result = await (dispatch(
        CreateCountries(createData)
      ) as unknown as Promise<{ success: boolean }>);
       
      console.log(result)
      
      if (result) {
        dispatch(setCountryError({}));
        table.setCreatingRow(null); // ✅ sirf success hone par close karo
      }

      // Reset comments after successful creation
      setComments("");
    } catch (error) {
      console.error("Error creating country:", error);
    }
  };

  const handleUpdate: MRT_TableOptions<Country>["onEditingRowSave"] = async ({
    values,
    row,
    table,
  }) => {
    try {
      if (row.original.id) {
        await (dispatch as AppDispatch)(
          UpdateCountries({ formData: values, editCountryId: row.original.id })
        );
      }
      table.setEditingRow(null);
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
    data: countries,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setCountryError(null));
    },
    onEditingRowCancel: () => {
      dispatch(setCountryError(null));
    },

    // Create dialog with custom comments field
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Country</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}

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
          {internalEditComponents.filter((_, index) => index !== 3)}{" "}
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
          Add New Country
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
