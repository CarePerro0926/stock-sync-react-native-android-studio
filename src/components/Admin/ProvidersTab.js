// src/components/Admin/ProvidersTab.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

const ProvidersTab = ({ proveedores = [] }) => {
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [filtroTxt, setFiltroTxt] = useState('');

  const proveedoresFiltrados = useMemo(() => {
    let list = [...(proveedores || [])];

    // Filtrar por estado (activo/inactivo)
    if (mostrarInactivos) {
      list = list.filter(p => p.deleted_at !== null && p.deleted_at !== undefined);
    } else {
      list = list.filter(p => !p.deleted_at);
    }

    // Filtrar por texto
    if (filtroTxt.trim()) {
      const term = filtroTxt.toLowerCase().trim();
      list = list.filter(p => {
        const idStr = String(p.id ?? '').toLowerCase();
        const nombreStr = String(p.nombre ?? '').toLowerCase();
        const emailStr = String(p.email ?? '').toLowerCase();
        return idStr.includes(term) || nombreStr.includes(term) || emailStr.includes(term);
      });
    }

    return list;
  }, [proveedores, mostrarInactivos, filtroTxt]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proveedores</Text>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ID, nombre o email..."
          value={filtroTxt}
          onChangeText={setFiltroTxt}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setMostrarInactivos(!mostrarInactivos)}
        >
          <View style={[styles.checkbox, mostrarInactivos && styles.checkboxChecked]}>
            {mostrarInactivos && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Mostrar inactivos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de proveedores */}
      <ScrollView style={styles.listContainer}>
        {proveedoresFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proveedores</Text>
          </View>
        ) : (
          proveedoresFiltrados.map(p => (
            <View key={p.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.value}>{p.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{p.nombre}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{p.email || '—'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Estado:</Text>
                <Text style={[styles.value, p.deleted_at ? styles.inactivo : styles.activo]}>
                  {p.deleted_at ? 'Inhabilitado' : 'Activo'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#243446',
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6c757d',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0F2C54',
    borderColor: '#0F2C54',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  listContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    flex: 0.4,
  },
  value: {
    fontSize: 16,
    color: '#212529',
    flex: 0.6,
    textAlign: 'right',
  },
  activo: {
    color: '#198754',
    fontWeight: 'bold',
  },
  inactivo: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default ProvidersTab;
