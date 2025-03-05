import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import useProductsTable from '../utils/hooks/useProductsTable';

const ProductTable = () => {

    const { columns, rows, paginationModel, loading } = useProductsTable();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
        </div>;
    }

    return (
        <Paper elevation={3} sx={{ height: 400, width: '100%', margin: 'auto', padding: '1em'}}>
            <Typography>Todos los Productos</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}

export default ProductTable;
