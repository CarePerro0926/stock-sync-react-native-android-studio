// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, ImageBackground, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginView from './src/components/LoginView';
import RegisterView from './src/components/RegisterView';
import PublicCatalogView from './src/components/PublicCatalogView';
import ClientView from './src/components/ClientView';
import AdminView from './src/components/AdminView';
import { productService } from './src/services/productService';
import { providerService } from './src/services/providerService';
import { categoryService } from './src/services/categoryService';
import { initialProductos, initialProveedores, initialCategorias } from './src/data/initialData';
import { useRealtimeSync } from './src/hooks/useRealtimeSync';
import logoFondo from './assets/logo-fondo.png';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#d32f2f' }}>
            Error en la aplicación
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            {this.state.error?.toString() || 'Error desconocido'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [vistaActual, setVistaActual] = useState('login');

  // Realtime sync
  useRealtimeSync(setProductos, setProveedores);

  // Restaurar sesión desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('userSession');
        if (storedSession) {
          const usr = JSON.parse(storedSession);
          setVistaActual(usr.role === 'administrador' ? 'admin' : 'client');
        }
      } catch (err) {
        console.error('Error loading session:', err);
      }
    };
    loadSession();
  }, []);

  const recargarProductos = async () => {
    const data = await productService.getAll();
    setProductos(data);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      const [productosRes, proveedoresRes, categoriasRes] = await Promise.allSettled([
        productService.getAll(),
        providerService.getAll(),
        categoryService.getAll(),
      ]);

      if (productosRes.status === 'fulfilled') {
        console.log(`Catálogo cargado desde Supabase: ${productosRes.value?.length || 0} productos`);
        setProductos(productosRes.value || []);
      } else {
        console.error('Error al cargar productos desde Supabase:', productosRes.reason);
        setProductos([]);
      }

      if (proveedoresRes.status === 'fulfilled') {
        setProveedores(proveedoresRes.value || []);
      } else {
        console.error('Error al cargar proveedores:', proveedoresRes.reason);
        setProveedores([]);
      }

      if (categoriasRes.status === 'fulfilled') {
        setCategorias(categoriasRes.value || []);
      } else {
        console.error('Error al cargar categorias:', categoriasRes.reason);
        setCategorias([]);
      }
    };
    cargarDatos();
  }, []);

  const handleLogin = async (usr) => {
    if (!usr) {
      alert('Usuario/clave inválidos');
      return;
    }
    try {
      await AsyncStorage.setItem('userSession', JSON.stringify(usr));
      setVistaActual(usr.role === 'administrador' ? 'admin' : 'client');
    } catch (err) {
      console.error('No se pudo guardar la sesión:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userSession');
      setVistaActual('login');
    } catch (err) {
      console.error('No se pudo eliminar userSession:', err);
    }
  };

  const handleShowCatalog = () => setVistaActual('catalog');
  const handleShowRegister = () => setVistaActual('register');
  const handleShowLogin = () => setVistaActual('login');

  const handleAddProducto = async (nuevoProducto) => {
    try {
      await productService.create(nuevoProducto);
      await recargarProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const handleAddProveedor = async (nuevoProveedor) => {
    try {
      await providerService.create(nuevoProveedor);
      const provs = await providerService.getAll();
      setProveedores(provs);
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  const handleAddCategoria = async (nombreCategoria) => {
    try {
      await categoryService.create(nombreCategoria);
      const cats = await categoryService.getAll();
      setCategorias(cats);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  const renderView = () => {
    switch (vistaActual) {
      case 'login':
        return (
          <LoginView
            onLogin={handleLogin}
            onShowRegister={handleShowRegister}
            onShowCatalog={handleShowCatalog}
          />
        );
      case 'register':
        return <RegisterView onShowLogin={handleShowLogin} />;
      case 'catalog':
        return (
          <PublicCatalogView
            productos={productos}
            categorias={categorias}
            onBack={handleShowLogin}
          />
        );
      case 'client':
        return (
          <ClientView
            productos={productos}
            categorias={categorias}
            carrito={carrito}
            setCarrito={setCarrito}
            onLogout={handleLogout}
          />
        );
      case 'admin':
        return (
          <AdminView
            productos={productos}
            proveedores={proveedores}
            categorias={categorias}
            onAddProducto={handleAddProducto}
            onAddProveedor={handleAddProveedor}
            onAddCategoria={handleAddCategoria}
            onLogout={handleLogout}
            recargarProductos={recargarProductos}
          />
        );
      default:
        return (
          <LoginView
            onLogin={handleLogin}
            onShowRegister={handleShowRegister}
            onShowCatalog={handleShowCatalog}
          />
        );
    }
  };

  return (
    <ImageBackground
      source={logoFondo}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
      <StatusBar barStyle="dark-content" />
      {renderView()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(244, 247, 250, 0.85)',
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

