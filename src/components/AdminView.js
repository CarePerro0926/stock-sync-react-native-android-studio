// src/components/AdminView.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import InventoryTab from './Admin/InventoryTab';
import AddTab from './Admin/AddTab';
import ProvidersTab from './Admin/ProvidersTab';
import UpdateTab from './Admin/UpdateTab';
import GestionarEstadoTab from './Admin/GestionarEstadoTab';
import UsuariosView from './UsuariosView';

const AdminView = ({
  productos = [],
  proveedores = [],
  categorias = [],
  onAddProducto,
  onAddProveedor,
  onAddCategoria,
  onLogout,
  recargarProductos
}) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showMenu, setShowMenu] = useState(false);

  const tabTitles = {
    'inventory': 'Inventario',
    'add': 'Agregar',
    'providers': 'Proveedores',
    'update': 'Actualizar',
    'delete': 'Gestionar Estado',
    'usuarios': 'Usuarios',
  };

  const selectTab = (tab) => {
    setActiveTab(tab);
    setShowMenu(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <InventoryTab
            productos={productos}
            categorias={categorias}
          />
        );
      case 'add':
        return (
          <AddTab
            onAddProducto={onAddProducto}
            onAddCategoria={onAddCategoria}
            onAddProveedor={onAddProveedor}
            proveedores={proveedores}
            categorias={categorias}
            productos={productos}
          />
        );
      case 'providers':
        return (
          <ProvidersTab proveedores={proveedores} />
        );
      case 'update':
        return (
          <UpdateTab
            productos={productos}
            categorias={categorias}
            proveedores={proveedores}
            onUpdateSuccess={recargarProductos}
          />
        );
      case 'delete':
        return (
          <GestionarEstadoTab
            productos={productos}
            proveedores={proveedores}
            categorias={categorias}
            onUpdateSuccess={recargarProductos}
          />
        );
      case 'usuarios':
        return (
          <UsuariosView />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.hamburgerButton}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{tabTitles[activeTab] || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */}
      {showMenu && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'inventory' && styles.menuItemActive]}
            onPress={() => selectTab('inventory')}
          >
            <Text style={[styles.menuItemText, activeTab === 'inventory' && styles.menuItemTextActive]}>
              Inventario
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'providers' && styles.menuItemActive]}
            onPress={() => selectTab('providers')}
          >
            <Text style={[styles.menuItemText, activeTab === 'providers' && styles.menuItemTextActive]}>
              Proveedores
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'add' && styles.menuItemActive]}
            onPress={() => selectTab('add')}
          >
            <Text style={[styles.menuItemText, activeTab === 'add' && styles.menuItemTextActive]}>
              Agregar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'update' && styles.menuItemActive]}
            onPress={() => selectTab('update')}
          >
            <Text style={[styles.menuItemText, activeTab === 'update' && styles.menuItemTextActive]}>
              Actualizar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'delete' && styles.menuItemActive]}
            onPress={() => selectTab('delete')}
          >
            <Text style={[styles.menuItemText, activeTab === 'delete' && styles.menuItemTextActive]}>
              Gestionar Estado
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, activeTab === 'usuarios' && styles.menuItemActive]}
            onPress={() => selectTab('usuarios')}
          >
            <Text style={[styles.menuItemText, activeTab === 'usuarios' && styles.menuItemTextActive]}>
              Usuarios
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#243446',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 12,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    elevation: 2,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  menuItemActive: {
    backgroundColor: '#e3e8ef',
  },
  menuItemText: {
    fontSize: 16,
    color: '#6c757d',
  },
  menuItemTextActive: {
    color: '#243446',
    fontWeight: '700',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});

export default AdminView;
