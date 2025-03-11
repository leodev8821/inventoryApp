import React, { useContext, useEffect, useMemo } from 'react';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import { Box, IconButton, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Logout, List, AddCircle, Inventory2, Login, HowToReg } from '@mui/icons-material';
import { Outlet, useLocation } from 'react-router-dom';
import { RouteContext } from '../utils/context/RouteContext';
import { AuthContext } from '../utils/context/AuthContext';
import useNavigation from "../utils/hooks/useNavigation";
import Register from './Register';
import NewCategoryForm from "../components/NewCategoryForm";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductsTable";
import ProhibitMessage from '../components/ProhibitMessage';

const AppLayout = () => {
  const { toggleType } = useContext(RouteContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { navigate } = useNavigation();

  const isAuthenticated = useMemo(() => !!user, [user]);

  

  // Definir la navegación de acuerdo a la autenticación
  const navigation = useMemo(() => {
    if (isAuthenticated) {
      return [
        { kind: 'header', title: 'Navegación' },
        { segment: 'dashboard/all-products', title: 'Todos los Productos', icon: <List /> },
        { segment: 'dashboard/new-category', title: 'Crear Categoría', icon: <AddCircle /> },
        { segment: 'dashboard/new-product', title: 'Crear Producto', icon: <AddCircle /> },
        { segment: 'dashboard/register-user', title: 'Registrar nuevo Usuario', icon: <HowToReg /> },
        { kind: 'header', title: 'Logout' },
        { segment: 'dashboard/logout', title: 'Logout', icon: <Logout />},
         
      ];
    } else {
      return [
        { kind: 'header', title: 'Login' },
        { title: 'Login', to: '/login', icon: <Login /> },
      ];
    }
  }, [isAuthenticated]);


  useEffect(() => {
    toggleType(location.pathname);
  }, [location.pathname, toggleType]);

  const myTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });


  return (
    <AppProvider
      navigation={navigation}
      router={{
        navigate: (to) => navigate(to)
      }}
      theme={myTheme}
    >
      <DashboardLayout
        branding={{
          title: 'InventoryApp'
        }}
        navigation={navigation}
        appBar={{
          position: 'sticky',
          sx: { zIndex: (theme) => theme.zIndex.drawer + 1 },
          actions: isAuthenticated ? (
            <IconButton aria-label="logout">
              <Logout />
            </IconButton>
          ) : null,
        }}
      >
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            mx: 'auto',
            minHeight: '50vh',
          }}
        >
          <Outlet />

        </Box>

      </DashboardLayout>
    </AppProvider>
  );
};

export default AppLayout;