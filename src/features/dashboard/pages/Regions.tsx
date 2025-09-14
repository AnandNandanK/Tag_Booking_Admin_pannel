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
  createRegions,
  listAllRegions,
  updateRegions,
  updateRegionStatus,
} from "../../../services/operations/location/regions";
import {
  setRegionError,
  type RegionResponse,
} from "../../../slices/locations/regionSlice";
import { getAllCountries } from "../../../services/operations/location/country";

export default function Regions() {
  const dispatch = useAppDispatch();
  const countries= useAppSelector((state) => state.country.data?.content || []);
  const region = useAppSelector((state) => state.region.data?.content || []);
  const regionError = useAppSelector((state) => state.region.error || {});
  const [countyId, setCountryId] = useState<number>(1);

  // console.log(countries);
  // console.log(regionError);

  console.log(regionError);
  // Fetch regions on mount
  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(listAllRegions());
  }, [dispatch]);

  // Columns
  const columns = useMemo<MRT_ColumnDef<RegionResponse>[]>(
    () => [
      

      {
        accessorKey: "countryName",
        header: "Country Name",
        editVariant: "select", // Make it a select dropdown

        // Options for the dropdown
        editSelectOptions: countries.map((country) => ({
          value: country.name,
          label: country.name,
        })),

        // Handle selection change to update countryId
        muiEditTextFieldProps: {
          required: true,
          onChange: (event) => {
            const selectedCountryName = event.target.value;
            const selectedCountry = countries.find(
              (country) => country.name === selectedCountryName
            );
            if (selectedCountry) {
              setCountryId(selectedCountry.id);
            }
          },
          
        },
      },

      {
        accessorKey: "name",
        header: "Region Name",
        required: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!regionError?.name,
          helperText: regionError?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setRegionError({
              ...regionError,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      }
     ,
      {
        accessorKey: "active",
        header: "Active",
        editVariant: "select",
        required: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!regionError?.active,
          helperText: regionError?.active,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setRegionError({
              ...regionError,
              active: undefined,
            }),
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
                  updateRegionStatus({
                    id: row.original.id,
                    countryId: row.original.countryId,
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
    [dispatch, regionError,countries]
  );

  // Create row save
  const handleCreate: MRT_TableOptions<RegionResponse>["onCreatingRowSave"] = async ({ values, table }) => {
      
      try {
          const createData = {
        name: values.name,
        active: values.active,
         countryId: countyId.toString(), // ensure number
      };

        // ✅ dispatch ke andar se actual return value nikalne ke liye await dispatch ko unwrap karo
        const result = await (dispatch(
          createRegions(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Result:", result);

        if (result.success) {
           dispatch(setRegionError({}));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
      } catch (error) {
        console.error("Error creating region:", error);
      }
    };

  // Update row save
  const handleUpdate: MRT_TableOptions<RegionResponse>["onEditingRowSave"] =async ({ values, row, table }) => {
      try {
        if (row.original.id) {
          await (dispatch as AppDispatch)(
            updateRegions({
              name: values.name, // input se aaya hua naya naam
              countryId: row.original.countryId.toString(), // API ko string chahiye
              regionId: row.original.id.toString(), // row ke id ko regionId bhejna hai
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
    data: region,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.id.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setRegionError({}));
    },
    onEditingRowCancel: () => {
      dispatch(setRegionError({}));
    },


    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Region</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
           {internalEditComponents}
          {/* Custom comments field - only appears in create dialog */}
             
          {/* Skip active field */}
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
            (_, index) => index !== 1 && index !== 2 
          )  }
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
          Add New Region
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}




// {
//         accessorKey: "countryName",
//         header: "Country Name",
//         editVariant: "select", // Make it a select dropdown

//         // Options for the dropdown
//         editSelectOptions: countries.map((country) => ({
//           value: country.name,
//           label: country.name,
//         })),
//         // Handle selection change to update countryId
//         muiEditTextFieldProps: {
//           required: true,
//           onChange: (event) => {
//             const selectedCountryName = event.target.value;
//             const selectedCountry = countries.find(
//               (country) => country.name === selectedCountryName
//             );
//             if (selectedCountry) {
//               setCountryId(selectedCountry.id);
//             }
//           },
//         },
//       },