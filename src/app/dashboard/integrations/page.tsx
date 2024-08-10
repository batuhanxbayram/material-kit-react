"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

interface EstateStatus {
  id: string;
  name: string;
  createdAt: string;
}

export default function EstateStatusPage(): React.JSX.Element {
  const [statuses, setStatuses] = React.useState<EstateStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: '' });
  const [editStatus, setEditStatus] = useState<EstateStatus | null>(null);

  React.useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get<EstateStatus[]>('http://localhost:5224/api/EstateStatus/list');
        setStatuses(response.data);
      } catch (error) {
        console.error('Error fetching estate statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editStatus) {
        // Update existing status
        await axios.put(`http://localhost:5224/api/EstateStatus/${editStatus.id}`, {
          ...newStatus,
          createdAt: editStatus.createdAt,
        });
      } else {
        // Add new status
        await axios.post('http://localhost:5224/api/EstateStatus', {
          ...newStatus,
          createdAt: new Date().toISOString(),
        });
      }

      setNewStatus({ name: '' }); // Clear form fields
      setEditStatus(null); // Reset editStatus
      setOpen(false); // Close modal
      // Refresh the list
      const response = await axios.get<EstateStatus[]>('http://localhost:5224/api/EstateStatus/list');
      setStatuses(response.data);
    } catch (error) {
      console.error('Error adding/updating estate status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (status: EstateStatus) => {
    setNewStatus({ name: status.name });
    setEditStatus(status);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5224/api/EstateStatus/${id}`);
      // Refresh the list
      const response = await axios.get<EstateStatus[]>('http://localhost:5224/api/EstateStatus/list');
      setStatuses(response.data);
    } catch (error) {
      console.error('Error deleting estate status:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Status Name', width: 200 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      renderCell: (params: GridRenderCellParams) =>
        dayjs(params.row.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={3} justifyContent="right" >
          <Button variant="contained" color="primary" onClick={() => handleEdit(params.row as EstateStatus)}>
            Düzenle
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)}>
            Sil
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Durumlar</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Ekle
          </Button>
        </div>
      </Stack>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={statuses}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editStatus ? 'Durumu Düzenle' : 'Yeni Durum Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Status Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStatus.name}
            onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="success">
            {editStatus ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
