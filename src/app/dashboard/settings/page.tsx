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

interface EstateType {
  id: string;
  name: string;
  createdAt: string;
}

export default function EstateTypePage(): React.JSX.Element {
  const [types, setTypes] = React.useState<EstateType[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState({ name: '' });
  const [editType, setEditType] = useState<EstateType | null>(null);

  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get<EstateType[]>('http://localhost:5224/api/EstateType/list');
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching estate types:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editType) {
        // Update existing type
        await axios.put(`http://localhost:5224/api/EstateType/${editType.id}`, {
          ...newType,
          createdAt: editType.createdAt,
        });
      } else {
        // Add new type
        await axios.post('http://localhost:5224/api/EstateType', {
          ...newType,
          createdAt: new Date().toISOString(),
        });
      }

      setNewType({ name: '' }); // Clear form fields
      setEditType(null); // Reset editType
      setOpen(false); // Close modal
      // Refresh the list
      const response = await axios.get<EstateType[]>('http://localhost:5224/api/EstateType/list');
      setTypes(response.data);
    } catch (error) {
      console.error('Error adding/updating estate type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: EstateType) => {
    setNewType({ name: type.name });
    setEditType(type);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5224/api/EstateType/${id}`);
      // Refresh the list
      const response = await axios.get<EstateType[]>('http://localhost:5224/api/EstateType/list');
      setTypes(response.data);
    } catch (error) {
      console.error('Error deleting estate type:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Type Name', width: 200 },
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
          <Button variant="contained" color="primary" onClick={() => handleEdit(params.row as EstateType)}>
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
          <Typography variant="h4">Türler</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Ekle
          </Button>
        </div>
      </Stack>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={types}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editType ? 'Türü Düzenle' : 'Yeni Tür Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Type Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newType.name}
            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="success">
            {editType ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
