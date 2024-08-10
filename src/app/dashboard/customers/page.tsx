"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

interface EstateCurrency {
  id: string;
  name: string;
  symbol: string;
  createdAt: string;
}

export default function Page(): React.JSX.Element {
  const [currency, setCurrency] = React.useState<EstateCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ name: '', symbol: '' });
  const [editCurrency, setEditCurrency] = useState<EstateCurrency | null>(null);

  React.useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get<EstateCurrency[]>('http://localhost:5224/api/EstateCurrency/list');
        setCurrency(response.data);
      } catch (error) {
        console.error('Error fetching estate currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true while submitting
    try {
      if (editCurrency) {
        // Update existing currency
        await axios.put(`http://localhost:5224/api/EstateCurrency/${editCurrency.id}`, {
          ...newCurrency,
          createdAt: editCurrency.createdAt,
        });
      } else {
        // Add new currency
        await axios.post('http://localhost:5224/api/EstateCurrency', {
          ...newCurrency,
          createdAt: new Date().toISOString(), // Example of setting createdAt
        });
      }

      setNewCurrency({ name: '', symbol: '' }); // Clear form fields
      setEditCurrency(null); // Reset editCurrency
      setOpen(false); // Close modal
      // Refresh the list
      const response = await axios.get<EstateCurrency[]>('http://localhost:5224/api/EstateCurrency/list');
      setCurrency(response.data);
    } catch (error) {
      console.error('Error adding/updating estate currency:', error);
    } finally {
      setLoading(false); // Set loading to false after submit attempt
    }
  };

  const handleEdit = (currency: EstateCurrency) => {
    setNewCurrency({ name: currency.name, symbol: currency.symbol });
    setEditCurrency(currency);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5224/api/EstateCurrency/${id}`);
      // Refresh the list
      const response = await axios.get<EstateCurrency[]>('http://localhost:5224/api/EstateCurrency/list');
      setCurrency(response.data);
    } catch (error) {
      console.error('Error deleting estate currency:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Currency Name', width: 200 },
    { field: 'symbol', headerName: 'Symbol', width: 100 },
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
          <Button variant="contained" color="primary" onClick={() => handleEdit(params.row as EstateCurrency)}>
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
          <Typography variant="h4">Para Birimleri</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Ekle
          </Button>
        </div>
      </Stack>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={currency}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          getRowId={(row) => row.id}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editCurrency ? 'Para Birimini Düzenle' : 'Yeni Para Birimi Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Currency Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCurrency.name}
            onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="symbol"
            label="Symbol"
            type="text"
            fullWidth
            variant="outlined"
            value={newCurrency.symbol}
            onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="success">
            {editCurrency ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
