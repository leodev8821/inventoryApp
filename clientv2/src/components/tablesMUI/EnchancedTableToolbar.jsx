import {
    Typography,
    Toolbar,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Edit, Delete, FilterList } from '@mui/icons-material';

const EnchancedTableToolbar = ({ numSelected, onEdit, onDelete }) => {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} seleccionados
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    component="div"
                >
                    Todos los Productos
                </Typography>
            )}
            {numSelected > 0 ? (
                <Box
                    component="form"
                    noValidate
                    sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignContent: 'center',
                        gap: 2
                    }}
                >
                    <Tooltip title="Editar">
                        <IconButton
                            onClick={onEdit}
                            disabled={numSelected !== 1}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton onClick={onDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>

            ) : (
                <Tooltip title="Filtrar lista">
                    <IconButton>
                        <FilterList />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default EnchancedTableToolbar;