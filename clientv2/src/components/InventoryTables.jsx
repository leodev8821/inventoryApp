import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Button
} from '@mui/material';
import { useToast } from '../utils/context/ToastContext';
import useInventoryTables from '../utils/hooks/useInventoryTables';

const InventoryTables = () => {
    const {
        columnsT1,
        columnsT2,
        rowsT1,
        rowsT2,
        loading,
        loadingAction,
        handleEdit
    } = useInventoryTables();
    const { notifySuccess, notifyError } = useToast();

    // Estados para paginación
    const [page1, setPage1] = useState(0);
    const [rowsPerPage1, setRowsPerPage1] = useState(5);
    const [page2, setPage2] = useState(0);
    const [rowsPerPage2, setRowsPerPage2] = useState(5);

    // Handlers de paginación
    const createPageHandler = (setPage) => (_, newPage) => setPage(newPage);
    const createRowsPerPageHandler = (setPage, setRowsPerPage) => (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filas paginadas
    const paginatedRowsT1 = useMemo(() =>
        rowsT1.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1),
        [rowsT1, page1, rowsPerPage1]
    );

    const paginatedRowsT2 = useMemo(() =>
        rowsT2.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2),
        [rowsT2, page2, rowsPerPage2]
    );

    const handleEditClick = async (row) => {
        const newQuantity = prompt('Ingrese la nueva cantidad:', row.quantity);
        if (newQuantity !== null) {
            const quantity = Number(newQuantity);
            if (!isNaN(quantity)) {
                const result = await handleEdit(parseInt(row.id), quantity);
                if (!result?.success) {
                    notifyError(result.error || "Error al actualizar");
                }
            } else {
                notifyError('Por favor ingrese un número válido');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    const renderTable = (
        actions,
        columns,
        rows,
        paginatedRows,
        page,
        rowsPerPage,
        totalRows,
        pageHandlers
    ) => (
        <Paper sx={{ width: '100%', mb: 4, p: 2 }}>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.field}
                                    align={col.type === 'number' ? 'right' : 'left'}
                                    sx={{ width: col.width }}
                                >
                                    {col.headerName}
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell key="actions">Acciones</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.field}
                                        align={col.type === 'number' ? 'right' : 'left'}
                                    >
                                        {col.type === 'number'
                                            ? Number(row[col.field]).toLocaleString()
                                            : row[col.field]}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell>
                                        {actions === 'edit' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditClick(row)}
                                                disabled={loadingAction}
                                            >
                                                Editar
                                            </Button>
                                        )}
                                        {actions === 'delete' && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDeleteClick(row)}
                                                disabled={loadingAction}
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {paginatedRows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    align="center"
                                >
                                    No hay datos disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={pageHandlers.pageHandler}
                onRowsPerPageChange={pageHandlers.rowsPerPageHandler}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </Paper>
    );

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {/* Tabla 1 */}
            {renderTable(null, columnsT1, rowsT1, paginatedRowsT1, page1, rowsPerPage1, rowsT1, {
                pageHandler: createPageHandler(setPage1),
                rowsPerPageHandler: createRowsPerPageHandler(setPage1, setRowsPerPage1)
            })}

            {/* Tabla 2 */}
            {renderTable('edit', columnsT2, rowsT2, paginatedRowsT2, page2, rowsPerPage2, rowsT2, {
                pageHandler: createPageHandler(setPage2),
                rowsPerPageHandler: createRowsPerPageHandler(setPage2, setRowsPerPage2)
            })}

            {loadingAction && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default InventoryTables;