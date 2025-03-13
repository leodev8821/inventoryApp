import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
    CircularProgress,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TablePagination,
    Checkbox,
} from '@mui/material';
import useProductsTable from '../utils/hooks/useProductsTable';
import { AuthContext } from '../utils/context/AuthContext';
import ProhibitMessage from './ProhibitMessage';
import EnchancedTableHead from './tablesMUI/EnchancedTableHead';
import EnchancedTableToolbar from './tablesMUI/EnchancedTableToolbar';
import useNavigation from '../utils/hooks/useNavigation';


const ProductTable = () => {
    const {
        columns,
        rows,
        loading,
        errors: { errorProduct, errorCategory },
        loadingAction,
        selected,
        setSelected,
        handleEdit,
        handleDelete
    } = useProductsTable();
    const { navigate } = useNavigation();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const headCells = columns.map(col => ({
        id: col.field,
        numeric: col.type === 'number',
        disablePadding: false,
        label: col.headerName,
        width: col.width
    }));

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex >= 0) {
            newSelected = newSelected.filter((item) => item !== id);
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const sortedRows = useMemo(() =>
        [...rows].sort((a, b) => {
            if (order === 'asc') {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            }
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows]
    );

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => navigate('/'), 1000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    if (!user) return <ProhibitMessage />;



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnchancedTableToolbar
                    numSelected={selected.length}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        size='small'
                        aria-labelledby="tablaProductos"
                    >
                        <EnchancedTableHead
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {sortedRows.map((row) => {
                                const isItemSelected = selected.includes(row.id);
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                            />
                                        </TableCell>
                                        {headCells.map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                align={cell.numeric ? 'right' : 'left'}
                                            >
                                                {cell.numeric ? Number(row[cell.id]).toLocaleString() : row[cell.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={headCells.length + 1} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>
            {loadingAction && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default ProductTable;