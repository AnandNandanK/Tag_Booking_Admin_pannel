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

import type { AppDispatch } from "../../../store/store";

import {
  createCities,
  listAllCities,
  updateCity,
  updateCityStatus,
} from "../../../services/operations/location/citiesApi";
import {
  clearCitiesError,
  setCitiesError,
  type citiesResponse,
} from "../../../slices/locations/citiesSlice";
import { listAllRegions } from "../../../services/operations/location/regions";

export default function Regions() {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.city.data?.content || []);
  const citiesError = useAppSelector((state) => state.city.error || {});
  const regions = useAppSelector((state) => state.region.data?.content|| []);

  const [regionId, setRegionId] = useState<number>(1);

  // console.log(cities);

  console.log(citiesError);
  // Fetch regions on mount

  useEffect(() => {
    dispatch(listAllCities());
    dispatch(listAllRegions());
  }, [dispatch]);

  // Columns
  const columns = useMemo<MRT_ColumnDef<citiesResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        required: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!citiesError?.name,
          helperText: citiesError?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            dispatch(
              setCitiesError({
                ...citiesError,
                name: undefined,
              })
            ),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: "regionName",
        header: "Region Name",
        editVariant: "select",

        // Options for the dropdown (use unique id for value)
        editSelectOptions: regions.map((region) => ({
          value: region.id, // ✅ unique value
          label: region.name, // shown to user
        })),

        muiEditTextFieldProps: {
          required: true,

          onChange: (event) => {
            const selectedCityId = Number(event.target.value); // ✅ get id instead of name
            setRegionId(selectedCityId);
          },

          error: !!citiesError?.name,
          helperText: citiesError?.name,

          // remove any previous validation errors when user focuses on the input
          onFocus: () =>
            dispatch(
              setCitiesError({
                ...citiesError,
                active: undefined,
              })
            ),
        },
      },
      
      { accessorKey: "countryName", header: "Country Name", required: true },

      {
        accessorKey: "active",
        header: "Active",
        editVariant: "select",
        required: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!citiesError?.active,
          helperText: citiesError?.active,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            dispatch(
              setCitiesError({
                ...citiesError,
                active: undefined,
              })
            ),
          //optionally add validation checking for onBlur or onChange
        },
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
                  updateCityStatus({
                    id: row.original.id,
                    regionId: row.original.regionId,
                    active: newValue,
                  })
                );
              }}
              color="primary"
            />
          );
        },
      },
    ],
    [dispatch, citiesError,regions,]
  );


  // Create row save
  const handleCreate: MRT_TableOptions<citiesResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        const createData = {
          name: values.name,
          active: values.active,
          regionId: regionId.toString(),
        };

        // ✅ dispatch ke andar se actual return value nikalne ke liye await dispatch ko unwrap karo
        const result = await (dispatch(
          createCities(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Result:", result);

        if (result.success) {
          console.log("running if condidion");
          dispatch(clearCitiesError());
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
      } catch (error) {
        console.error("Error creating region:", error);
      }
    };

  // Update row save
  const handleUpdate: MRT_TableOptions<citiesResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      console.log(row.original);
      try {
        if (row.original.id) {
          await (dispatch as AppDispatch)(
            updateCity({
              name: values.name, // input se aaya hua naya naam
              cityId: row.original.id.toString(), // API ko string chahiye
              regionId: row.original.regionId.toString(), // row ke id ko regionId bhejna hai
            })
          );
        }
        table.setEditingRow(null);
      } catch (error) {
        console.error("Error updating region:", error);
      }
    };

  // Export CSV
  const handleExportCSV = () => {
    const rowModel = table.getFilteredRowModel().rows;
    if (!rowModel.length) return;

    const headers = table
      .getAllLeafColumns()
      .filter((col) => col.id !== "mrt-row-actions")
      .map((col) => col.columnDef.header)
      .join(",");

    const csvRows = rowModel.map((row) =>
      row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== "mrt-row-actions")
        .map((cell) => {
          const value = cell.getValue();
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
    a.download = "regions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Table setup
  const table = useMaterialReactTable({
    columns,
    data: cities,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(clearCitiesError());
    },
    onEditingRowCancel: () => {
      dispatch(clearCitiesError());
    },

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New City</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index !== 2)}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit Region</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter(
            (_, index) => index !== 1 && index !== 2 && index !== 3
          )}
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
          Add New City
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
