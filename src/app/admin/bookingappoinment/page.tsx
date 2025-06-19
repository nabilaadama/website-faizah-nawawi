"use client";

import React, { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
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
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import { Delete, Edit, Refresh } from "@mui/icons-material";
import { Booking } from "@/core/entities/booking";
import { useBookings } from "@/presentation/hooks/admin/use-booking";
import { MessageCircle } from "lucide-react";

const AdminBookingsPage = () => {
  const {
    bookings,
    loading,
    error,
    refetch,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    bookingService
  } = useBookings();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = useMemo<MRT_ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        enableEditing: false,
      },
      {
        accessorKey: "whatsapp",
        header: "WhatsApp",
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: "appointmentDate",
        header: "Tanggal Janji",
        size: 180,
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return date
            ? new Intl.DateTimeFormat("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(date)
            : "-";
        },
        muiEditTextFieldProps: {
          type: "datetime-local",
          required: true,
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ cell }) => {
          const status = cell.getValue<Booking["status"]>();
          return (
            <Chip
              label={bookingService.getStatusLabel(status)}
              size="small"
              sx={{
                backgroundColor: bookingService.getStatusColor(status),
                color: "white",
                fontWeight: "bold",
              }}
            />
          );
        },
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          children: [
            <MenuItem key="pending" value="pending">
              Menunggu
            </MenuItem>,
            <MenuItem key="confirmed" value="confirmed">
              Dikonfirmasi
            </MenuItem>,
            <MenuItem key="completed" value="completed">
              Selesai
            </MenuItem>,
            <MenuItem key="cancelled" value="cancelled">
              Dibatalkan
            </MenuItem>,
          ],
        }),
      },
      {
        accessorKey: "notes",
        header: "Catatan",
        size: 200,
        enableEditing: false,
        Cell: ({ cell }) => {
          const notes = cell.getValue<string>();
          return notes ? (
            <Tooltip title={notes} arrow>
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "200px",
                }}
              >
                {notes}
              </Typography>
            </Tooltip>
          ) : (
            "-"
          );
        },
        muiEditTextFieldProps: {
          multiline: true,
          rows: 3,
        },
      },
      {
        accessorKey: "createdAt",
        header: "Dibuat",
        size: 150,
        enableEditing: false,
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return date
            ? new Intl.DateTimeFormat("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(date)
            : "-";
        },
      },
    ],
    [bookingService]
  );

  const handleSaveBooking: MRT_TableOptions<Booking>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    const updatedData: Partial<Booking> = {
      appointmentDate: new Date(values.appointmentDate),
      status: values.status as Booking['status'],
    };

    const result = await updateBooking(row.original.id, updatedData);
    
    if (result.success) {
      exitEditingMode();
      showSnackbar('Booking berhasil diperbarui', 'success');
    } else {
      showSnackbar(result.error || 'Gagal memperbarui booking', 'error');
    }
  };

  const handleDeleteBooking = async (row: MRT_Row<Booking>) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      const result = await deleteBooking(row.original.id);
      
      if (result.success) {
        showSnackbar('Booking berhasil dihapus', 'success');
      } else {
        showSnackbar(result.error || 'Gagal menghapus booking', 'error');
      }
    }
  };

  const openWhatsApp = (phoneNumber: string, appointmentDate: string) => { 
    if (!phoneNumber) {
      alert('Nomor telepon tidak tersedia');
      return;
    }

    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert('Format nomor telepon tidak valid');
      return;
    }

    const message = `Halo, saya dari admin Faizah Nawawi. Terkait booking appointment Anda pada tanggal ${appointmentDate}, ingin mengonfirmasi terkait appoinment Anda.`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('Original phone:', phoneNumber);
    console.log('Cleaned phone:', cleanPhone);
    console.log('WhatsApp URL:', whatsappUrl);
    
    window.open(whatsappUrl, '_blank');
  };

  

  // const handleQuickStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
  //   const result = await updateBookingStatus(bookingId, newStatus);
    
  //   if (result.success) {
  //     showSnackbar(`Status berhasil diubah ke ${bookingService.getStatusLabel(newStatus)}`, 'success');
  //   } else {
  //     showSnackbar(result.error || 'Gagal mengubah status', 'error');
  //   }
  // };

  const table = useMaterialReactTable({
    columns,
    data: bookings,
    positionActionsColumn: "last",
    createDisplayMode: "modal",
    editDisplayMode: "row",
    enableEditing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "createdAt", desc: true }],
    },
    muiToolbarAlertBannerProps: error
      ? {
          color: "error",
          children: error,
        }
      : undefined,
    onEditingRowSave: handleSaveBooking,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => table.setEditingRow(row)}
            color="primary"
            size="small"
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handleDeleteBooking(row)}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title="Contact via WhatsApp">
          <IconButton
            onClick={() => openWhatsApp(row.original.whatsapp, row.original.appointmentDate.toLocaleString())}
            size="small"
            sx={{ color: '#25d366' }}
          >
            <MessageCircle size={16} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    // renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
    //   <>
    //     <DialogTitle variant="h6">Edit Booking</DialogTitle>
    //     <DialogContent
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         gap: "1.5rem",
    //         pt: 2,
    //       }}
    //     >
    //       {internalEditComponents}

    //       {/* Quick Status Update Buttons */}
    //       <Box>
    //         <Typography variant="subtitle2" gutterBottom>
    //           Quick Status Update:
    //         </Typography>
    //         <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
    //           {(
    //             [
    //               "pending",
    //               "confirmed",
    //               "completed",
    //               "cancelled",
    //             ] as Booking["status"][]
    //           ).map((status) => (
    //             <Button
    //               key={status}
    //               variant="outlined"
    //               size="small"
    //               onClick={() =>
    //                 handleQuickStatusUpdate(row.original.id, status)
    //               }
    //               sx={{
    //                 borderColor: bookingService.getStatusColor(status),
    //                 color: bookingService.getStatusColor(status),
    //                 "&:hover": {
    //                   backgroundColor: bookingService.getStatusColor(status),
    //                   color: "white",
    //                 },
    //               }}
    //             >
    //               {bookingService.getStatusLabel(status)}
    //             </Button>
    //           ))}
    //         </Box>
    //       </Box>
    //     </DialogContent>
    //     <DialogActions>
    //       <MRT_EditActionButtons variant="text" table={table} row={row} />
    //     </DialogActions>
    //   </>
    // ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Tooltip title="Refresh">
          <IconButton onClick={refetch}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: loading,
    },
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#5C4033",
          }}
        >
          Booking Management
        </Typography>
      </Box>
      <MaterialReactTable table={table} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBookingsPage;
