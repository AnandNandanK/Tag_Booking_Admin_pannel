import React, { useMemo, useEffect, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import type { SelectChangeEvent } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import {
  createEvent,
  listAllEvents,
  updateEvent,
  updateVenueStatus,
  type CreateEventProps,
} from "../../../services/operations/eventApi";
import type { EventResponse } from "../../../interfaces/eventInterFace";
import { listAllOrganizers } from "../../../services/operations/organizerApi";
import { listAllArtists } from "../../../services/operations/artistApi";
import { clearEventsError, setEventsError } from "../../../slices/eventSlice";

const LANGUAGE_OPTIONS = ["English", "Swahili"];

export default function EventComponent() {
  const dispatch = useAppDispatch();

  const [organiserId, setOrganiserId] = useState<number>();

  const eventError = useAppSelector((state) => state.event.error);

  const events = useAppSelector((state) => state.event.data || []);
  const artists = useAppSelector((state) => state.artist.data || []);
  const organisers = useAppSelector((state) => state.organizer.data || []);

  useEffect(() => {
    dispatch(listAllEvents());
    dispatch(listAllOrganizers());
    dispatch(listAllArtists());
  }, [dispatch]);

  // Columns - NO customField column here
  const columns = useMemo<MRT_ColumnDef<EventResponse>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!eventError?.name,
          helperText: eventError?.name,
          onFocus: () =>
            dispatch(
              setEventsError({
                ...eventError,
                name: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "shortDescription",
        header: "Short Description",
        muiEditTextFieldProps: {
          required: true,
          error: !!eventError?.shortDescription,
          helperText: eventError?.shortDescription,
          onFocus: () =>
            dispatch(
              setEventsError({
                ...eventError,
                name: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "longDescription",
        header: "Long Description",
      },

      {
        accessorKey: "termsAndConditions",
        header: "Terms And Conditions",

        Cell: ({ row }) => {
          const terms: string[] = row.original.termsAndConditions || [];
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <div>
              <Button variant="outlined" size="small" onClick={handleOpen}>
                View Terms
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {terms.map((term, idx) => (
                  <MenuItem key={idx} onClick={handleClose}>
                    {idx + 1}. {term}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        },

        // Edit mode
        Edit: ({ cell, row }) => {
          const initialValue: string[] = cell.getValue<string[]>() || [];
          const [terms, setTerms] = useState<string[]>(initialValue);
          const [input, setInput] = useState("");

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && input.trim() !== "") {
              e.preventDefault();
              const newTerms = [...terms, input.trim()];
              setTerms(newTerms);
              setInput("");

              // Update the row value as array
              row._valuesCache["termsAndConditions"] = newTerms;
            }
          };

          const handleRemove = (index: number) => {
            const newTerms = terms.filter((_, i) => i !== index);
            setTerms(newTerms);
            row._valuesCache["termsAndConditions"] = newTerms;
          };

          return (
            <div>
              <div className="flex flex-col gap-1.5">
                <label>Enter Terms&Conditions</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type term and press Enter"
                  className="border p-1 rounded w-full "
                />
              </div>

              <div className="mt-1 flex flex-wrap gap-1">
                {terms.map((term, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "genre",
        header: "Genre",
      },

      {
        accessorKey: "languages",
        header: "Languages",
        muiEditTextFieldProps: {
          required: true,
          error: !!eventError?.languages,
          helperText: eventError?.languages,
          onFocus: () =>
            dispatch(
              setEventsError({
                ...eventError,
                languages: undefined,
              })
            ),
        },

        Edit: ({ cell, row }) => {
          const initialValue = (cell.getValue() as string[]) || [];
          const [selectedEvents, setSelectedEvents] =
            useState<string[]>(initialValue);

          const toggleEvent = (event: string) => {
            let newValue: string[];
            if (selectedEvents.includes(event)) {
              newValue = selectedEvents.filter((e) => e !== event);
            } else {
              newValue = [...selectedEvents, event];
            }

            setSelectedEvents(newValue);

            // ✅ Update the row cache so create/save picks it up
            row._valuesCache["languages"] = newValue;
          };

          return (
            <div className="p-2 w-96">
              <label className="block text-sm font-medium mb-2">
                Select Language
              </label>
              <div className="flex flex-col gap-1">
                {LANGUAGE_OPTIONS.map((event) => (
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
        accessorKey: "durationMinutes",
        header: "Duration Minutes",
        muiEditTextFieldProps: {
          required: true,
          error: !!eventError?.durationMinutes,
          helperText: eventError?.durationMinutes,
          onFocus: () =>
            dispatch(
              setEventsError({
                ...eventError,
                durationMinutes: undefined,
              })
            ),
        },
      },
      {
        accessorKey: "ageRestriction",
        header: "Age Restriction",
      },
      {
        accessorKey: "certification",
        header: "Certification",
      },

      {
        accessorKey: "releaseDate",
        header: "Release Date",
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
            row._valuesCache["releaseDate"] = formatted;
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
        accessorKey: "posterUrl",
        header: "Poster Url",
      },
      {
        accessorKey: "thumbnailUrl",
        header: "Thumbnail Url",
      },
      {
        accessorKey: "trailerUrl",
        header: "Trailer Url",
      },
      {
        accessorKey: "basePrice",
        header: "Base Price",
        muiEditTextFieldProps: {
          required: true,
          error: !!eventError?.basePrice,
          helperText: eventError?.basePrice,
          onFocus: () =>
            dispatch(
              setEventsError({
                ...eventError,
                basePrice: undefined,
              })
            ),
        },
      },

      {
        accessorKey: "organizerName",
        header: "Organizer Name",
        editVariant: "select", // Make it a select dropdown

        // Options for the dropdown
        editSelectOptions: organisers.map((organiser) => ({
          value: organiser.name,
          label: organiser.name,
        })),

        // Handle selection change to update countryId
        muiEditTextFieldProps: {
          required: true,
          onChange: (event) => {
            const selectedOrganiserName = event.target.value;
            const selectedOrganiser = organisers.find(
              (organiser) => organiser.name === selectedOrganiserName
            );
            if (selectedOrganiser) {
              setOrganiserId(selectedOrganiser.id);
            }
          },
        },
      },

      {
        accessorKey: "artists",
        header: "Artists",

        Cell: () => {
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <div>
              <Button variant="outlined" size="small" onClick={handleOpen}>
                Artist Details
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {events?.map((event) => (
                  <MenuItem key={event.eventId} onClick={handleClose}>
                    {event.artists.map((artist, idx) => {
                      // List of fields to display
                      const fields: { label: string; value: string }[] = [
                        { label: "Name", value: artist.name },
                        { label: "Description", value: artist.description },
                        { label: "Image URL", value: artist.imageUrl },
                        { label: "DOB", value: artist.dateOfBirth },
                        { label: "Nationality", value: artist.nationality },
                        { label: "Website URL", value: artist.websiteUrl },
                        {
                          label: "Instagram Handle",
                          value: artist.instagramHandle ?? "",
                        },
                        {
                          label: "Twitter Handle",
                          value: artist.twitterHandle ?? "",
                        },
                        {
                          label: "Active",
                          value: artist.active ? "Yes" : "No",
                        },
                        { label: "Role", value: artist.role },
                      ];

                      return (
                        <Box key={idx} mb={1}>
                          {fields.map((field) => (
                            <Typography variant="body2" key={field.label}>
                              <strong>{field.label}:</strong>{" "}
                              {field.value ?? "N/A"}
                            </Typography>
                          ))}
                        </Box>
                      );
                    })}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          );
        },

        Edit: ({ cell, row }) => {
          const initialSelected = (row.original.artists || []).map((a) => ({
            artistId: a.id,
            role: a.role || "",
          }));

          const [selectedArtists, setSelectedArtists] =
            React.useState(initialSelected);

          const roleOptions = [
            "OTHER",
            "MUSICIAN",
            "PRODUCER",
            "WRITER",
            "ACTOR",
            "HOST",
            "CHOREOGRAPHER",
            "SINGER",
            "DIRECTOR",
          ];

          const handleArtistChange = (event: SelectChangeEvent<number[]>) => {
            const value = event.target.value as number[];
            const newSelected = value.map((id) => {
              const existing = selectedArtists.find((a) => a.artistId === id);
              return existing ? existing : { artistId: id, role: "" };
            });

            setSelectedArtists(newSelected);
            row._valuesCache["artists"] = newSelected;
          };

          const handleRoleChange = (id: number, newRole: string) => {
            const updated = selectedArtists.map((artist) =>
              artist.artistId === id ? { ...artist, role: newRole } : artist
            );
            setSelectedArtists(updated);
            row._valuesCache["artists"] = updated;
          };

          return (
            <div className="flex flex-col gap-2 w-96">
              {/* Multi-select artistId */}
              <Select
                multiple
                value={selectedArtists.map((a) => a.artistId)}
                onChange={handleArtistChange}
                displayEmpty
                renderValue={(selectedIds) =>
                  selectedIds.length === 0 ? (
                    <em>Select artist</em>
                  ) : (
                    artists
                      .filter((a) => selectedIds.includes(Number(a.id)))
                      .map((a) => a.name)
                      .join(", ")
                  )
                }
                fullWidth
              >
                {artists.map((artist) => (
                  <MenuItem key={artist.id} value={Number(artist.id)}>
                    <Checkbox
                      checked={selectedArtists.some(
                        (a) => a.artistId === Number(artist.id)
                      )}
                    />
                    <ListItemText primary={artist.name} />
                  </MenuItem>
                ))}
              </Select>

              {/* Role dropdown for each selected artist */}
              {selectedArtists.map((artist) => (
                <div key={artist.artistId} className="flex items-center gap-2">
                  <span className="w-24">
                    {artists.find((a) => a.id === artist.artistId)?.name}
                  </span>

                  <Select
                    size="small"
                    value={artist.role || ""}
                    onChange={(e) =>
                      handleRoleChange(artist.artistId, e.target.value)
                    }
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select Role</em>
                    </MenuItem>
                    {roleOptions.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          );
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        enableEditing: false, // ❌ inline edit disable kar diya, kyunki hum custom Select dikha rahe hain
        Cell: ({ row }) => {
          const status = row.original.status as
            | "DRAFT"
            | "UPCOMING"
            | "ACTIVE"
            | "COMPLETED"
            | "CANCELLED"
            | null;

          return (
            <Select
              value={status ?? ""} // null ho to empty string
              onChange={(e) => {
                const newStatus = e.target.value as
                  | "DRAFT"
                  | "UPCOMING"
                  | "ACTIVE"
                  | "COMPLETED"
                  | "CANCELLED";

                dispatch(
                  updateVenueStatus({
                    id: row.original.eventId,
                    status: newStatus, // string jaayegi API me
                  })
                );
              }}
              size="small"
              fullWidth
            >
              <MenuItem value="ACTIVE">DRAFT</MenuItem>
              <MenuItem value="INACTIVE">UPCOMING</MenuItem>
              <MenuItem value="UNDER_MAINTENANCE">ACTIVE</MenuItem>
              <MenuItem value="CLOSED">COMPLETED</MenuItem>
              <MenuItem value="CLOSED" className="text-red-500">
                CANCELLED
              </MenuItem>
            </Select>
          );
        },
      },
    ],
    [dispatch, events, artists, eventError, organisers]
  );

  const handleCreate: MRT_TableOptions<EventResponse>["onCreatingRowSave"] =
    async ({ values, table }) => {
      try {
        console.log(values);

        // ✅ Only pick required fields for VenueRequest
        const createData: CreateEventProps = {
          name: values.name || "", // Event name
          shortDescription: values.shortDescription || "",
          longDescription: values.longDescription || "",
          termsAndConditions: values.termsAndConditions || [], // Array of terms
          category: values.category || "CONCERT", // Default if needed
          genre: values.genre || "ACTION", // Default if needed
          languages: values.languages || [], // Array of selected languages
          durationMinutes: Number(values.durationMinutes) || 0,
          ageRestriction: Number(values.ageRestriction) || 0,
          certification: values.certification || "",
          releaseDate: values.releaseDate || new Date().toISOString(),
          posterUrl: values.posterUrl || "",
          thumbnailUrl: values.thumbnailUrl || "",
          trailerUrl: values.trailerUrl || "",
          basePrice: Number(values.basePrice) || 0,
          organizerId: organiserId || 0, // Make sure this is the ID of selected organizer
          artists: values.artists || [], // Array of objects like { artistId: number, role: string }
        };

        // console.log(createData);
        // Dispatch the action
        const result = await (dispatch(
          createEvent(createData)
        ) as unknown as Promise<{ success: boolean }>);

        console.log("Result:", result);

        if (result.success) {
          dispatch(setEventsError(null));
          table.setCreatingRow(null); // ✅ sirf success hone par close karo
        }
      } catch (error) {
        console.error("Error creating venue:", error);
      }
    };

  const handleUpdate: MRT_TableOptions<EventResponse>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      try {
        // ✅ Only pick required fields for VenueRequest
        const formData: CreateEventProps = {
          name: values.name || "", // Event name
          shortDescription: values.shortDescription || "",
          longDescription: values.longDescription || "",
          termsAndConditions: values.termsAndConditions || [], // Array of terms
          category: values.category || "CONCERT", // Default if needed
          genre: values.genre || "ACTION", // Default if needed
          languages: values.languages || [], // Array of selected languages
          durationMinutes: Number(values.durationMinutes) || 0,
          ageRestriction: Number(values.ageRestriction) || 0,
          certification: values.certification || "",
          releaseDate: values.releaseDate || new Date().toISOString(),
          posterUrl: values.posterUrl || "",
          thumbnailUrl: values.thumbnailUrl || "",
          trailerUrl: values.trailerUrl || "",
          basePrice: Number(values.basePrice) || 0,
          organizerId: values.organizerId || 0, // Make sure this is the ID of selected organizer
          artists: values.artists || [], // Array of objects like { artistId: number, role: string }
        };

        const result = await (dispatch(
          updateEvent({ formData, id: row.original.eventId })
        ) as unknown as Promise<{ success: boolean }>);

        console.log(result);

        if (result.success) {
          table.setEditingRow(null);
          dispatch(clearEventsError());
        }
      } catch (error) {
        console.error("Error updating country:", error);
      }
    };

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
    data: events,
    enableEditing: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    getRowId: (row) => row.eventId.toString(),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,

    // ✅ jab form cancel ya band ho
    onCreatingRowCancel: () => {
      dispatch(setEventsError(null));
    },
    onEditingRowCancel: () => {
      dispatch(setEventsError(null));
    },

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {internalEditComponents.filter((_, index) => index < 17)}

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
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents.filter((_, index) => index < 17)}
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
          Add New Event
        </Button>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
