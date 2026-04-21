// src/components/Admin/InventoryTab.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InventoryTab = ({ productos = [], categorias = [] }) => {
  const [filtroCat, setFiltroCat] = useState('Todas');
  const [filtroTxt, setFiltroTxt] = useState('');
  const normalizar = (valor) => String(valor ?? '').trim().toLowerCase();

  const cats = useMemo(() => (Array.isArray(categorias) ? categorias : []), [categorias]);

  const productosConNombreCategoria = useMemo(() => {
    return (productos || []).map((p) => {
      if (p?.categoria_nombre) return p;
      const categoria = cats.find((c) => String(c.id) === String(p.categoria_id));
      return {
        ...p,
        categoria_nombre: categoria?.nombre || p?.categoria || 'Sin Categoría',
      };
    });
  }, [productos, cats]);

  const listaCategoriasFiltro = useMemo(() => {
    const nombresDesdeProductos = (productosConNombreCategoria || [])
      .map(p => p?.categoria_nombre ?? '')
      .filter(nombre => nombre && String(nombre).trim() !== '');
    const nombresDesdeProp = (cats || [])
      .map(c => c?.nombre ?? '')
      .filter(nombre => nombre && String(nombre).trim() !== '');
    const combined = [...nombresDesdeProductos, ...nombresDesdeProp];
    const unicas = [...new Set(combined.map(nombre => String(nombre).trim()))];
    return ['Todas', ...unicas];
  }, [productosConNombreCategoria, cats]);

  const productosFiltrados = useMemo(() => {
    return productosConNombreCategoria.filter(p => {
      const coincideCat =
        filtroCat === 'Todas' ||
        normalizar(p.categoria_nombre) === normalizar(filtroCat);
      const coincideTxt = !filtroTxt ||
        (p.nombre && p.nombre.toLowerCase().includes(filtroTxt.toLowerCase())) ||
        (p.id && String(p.id).toLowerCase().includes(filtroTxt.toLowerCase()));
      return coincideCat && coincideTxt;
    });
  }, [productosConNombreCategoria, filtroCat, filtroTxt]);

  const renderProducto = ({ item: p }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{p.nombre || 'Sin nombre'}</Text>
      <Text style={styles.productDetail}>ID: {p.id || '—'}</Text>
      <Text style={styles.productDetail}>
        Categoría: {p.categoria_nombre || p.categoria || 'Sin Categoría'}
      </Text>
      <Text style={styles.productDetail}>Stock: {p.cantidad ?? 0}</Text>
      <Text style={styles.productPrice}>
        ${typeof p.precio === 'number' ? p.precio.toLocaleString('es-CO') : '—'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario de Productos</Text>

      <View style={styles.filterContainer}>
        <View style={styles.categoryFilterBox}>
          <Text style={styles.categoryFilterTitle}>Categorias</Text>
          <Text style={styles.categoryFilterHint}>Filtra inventario por categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtroCat}
              onValueChange={(value) => setFiltroCat(value)}
              style={styles.picker}
              dropdownIconColor="#243446"
              itemStyle={styles.pickerItem}
            >
              {listaCategoriasFiltro.map((cat, idx) => (
                <Picker.Item key={idx} label={cat} value={cat} color="#FFFFFF" />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.filterLabel}>Buscar:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ID..."
          value={filtroTxt}
          onChangeText={setFiltroTxt}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        renderItem={renderProducto}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 15,
  },
  categoryFilterBox: {
    borderWidth: 2,
    borderColor: '#243446',
    borderRadius: 10,
    backgroundColor: '#edf1f5',
    padding: 10,
    marginBottom: 8,
  },
  categoryFilterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#243446',
    marginBottom: 2,
  },
  categoryFilterHint: {
    fontSize: 12,
    color: '#5b6978',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    color: '#243446',
  },
  pickerItem: {
    color: '#243446',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default InventoryTab;
