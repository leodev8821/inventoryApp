import React, { useContext, useEffect, useMemo } from 'react';
import { AppProvider, DashboardLayout } from '@toolpad/core';
import { Box, IconButton, Card, CardContent, CircularProgress } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Logout, List, AddCircle } from '@mui/icons-material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { RouteContext } from '../utils/context/RouteContext';
import { AuthContext } from '../utils/context/AuthContext';
import useNavigation from "../utils/hooks/useNavigation";

const AppLayout = () => {
  const { toggleType } = useContext(RouteContext);
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const { navigate } = useNavigation();

  const isAuthenticated = useMemo(() => !!user, [user]);

  // Definir la navegación de acuerdo a la autenticación
  const navigation = useMemo(() => {
    if (isAuthenticated) {
      return [
        { kind: 'header', title: 'Navegación' },
        { segment: 'products-table', title: 'Todos los Productos', to: '/dashboard/products-table', icon: <List /> },
        { segment: 'new-category', title: 'Crear Categoría', to: '/dashboard/new-category', icon: <AddCircle /> },
        { segment: 'new-product', title: 'Crear Producto', to: '/dashboard/new-product', icon: <AddCircle /> },
        { kind: 'header', title: 'Logout' },
        { segment: 'logout', title: 'Ir a Login', to: '/login', icon: <Logout /> },
      ];
    } else {
      return [
        { kind: 'header', title: 'Logout' },
        { label: 'Ir a Login', to: '/login', icon: <Logout /> },
      ];
    }
  }, [isAuthenticated]);

  // Actualizar el estado de tipo de vista cuando cambia la ruta
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

  // Función de logout
  const handleLogout = () => {
    logout();
    navigate('/login');  // Redirige al login
  };

  return (
    <AppProvider
      navigation={navigation}  // Pasa la navegación correctamente
      router={{
        navigate: (to) => navigate(to), // Utiliza `navigate` de react-router-dom
      }}
      theme={myTheme}
    >
      <DashboardLayout
        navigation={navigation.map(item => ({
          kind: item.kind,
          title: item.title,
          to: item.to,    // Asegúrate de pasar correctamente `to` con Link
          icon: item.icon,
          href: item.to,
          component: Link, // Usar Link para las rutas
        }))}
        appBar={{
          position: 'sticky',
          sx: { zIndex: (theme) => theme.zIndex.drawer + 1 },
          actions: isAuthenticated ? (
            <IconButton aria-label="logout" onClick={handleLogout}>
              <Logout />
            </IconButton>
          ) : null,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default AppLayout;