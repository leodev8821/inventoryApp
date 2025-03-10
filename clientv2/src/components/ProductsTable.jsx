import React, { useContext, useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import useProductsTable from '../utils/hooks/useProductsTable';
import { AuthContext } from '../utils/context/AuthContext';
import ProhibitMessage from './ProhibitMessage';
import useNavigation from '../utils/hooks/useNavigation';

const ProductTable = () => {
    const { columns, rows, paginationModel, loading } = useProductsTable();
    const { navigate } = useNavigation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [user]);

    if (!user) {
        return (
            <ProhibitMessage />
        )
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
        </div>;
    }

    return (
        <Paper elevation={3} sx={{ height: 400, width: '100%', margin: 'auto', padding: '1em' }}>
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
