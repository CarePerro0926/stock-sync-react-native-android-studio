// src/components/PublicCatalogView.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PublicCatalogView = ({ productos = [], categorias = [], onBack }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [textoBusqueda, setTextoBusqueda] = useState('');

  const cats = useMemo(() => {
    return Array.isArray(categorias) ? categorias : [];
  }, [categorias]);

  const prods = useMemo(() => {
    return Array.isArray(productos) ? productos : [];
  }, [productos]);

  const productosConNombreCategoria = useMemo(() => {
    return prods.map(p => {
      if (p.categoria_nombre) return p;
      const categoria = cats.find(c => String(c.id) === String(p.categoria_id));
      return {
        ...p,
        categoria_nombre: categoria?.nombre || 'Sin Categoría'
      };
    });
  }, [prods, cats]);

  const categoriasFiltro = useMemo(() => {
    const nombresDesdeCategorias = cats
      .map(c => c?.nombre ?? '')
      .filter(nombre => String(nombre).trim() !== '');
    const nombresDesdeProductos = productosConNombreCategoria
      .map(p => p?.categoria_nombre ?? '')
      .filter(nombre => String(nombre).trim() !== '');

    const unicas = [...new Set([...nombresDesdeCategorias, ...nombresDesdeProductos])];
    return ['Todas', ...unicas];
  }, [cats, productosConNombreCategoria]);

  const productosFiltrados = useMemo(() => {
    return productosConNombreCategoria.filter(p => {
      const coincideCategoria =
        !categoriaSeleccionada ||
        categoriaSeleccionada === 'Todas' ||
        String(p.categoria_nombre) === String(categoriaSeleccionada);
      const coincideTexto =
        textoBusqueda === '' || p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
      return coincideCategoria && coincideTexto;
    });
  }, [productosConNombreCategoria, categoriaSeleccionada, textoBusqueda]);

  const renderProducto = ({ item: p }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{p.nombre ?? 'Sin nombre'}</Text>
      <Text style={styles.productDetail}>ID: {p.id ?? '—'}</Text>
      <Text style={styles.productDetail}>Categoría: {p.categoria_nombre ?? 'Sin Categoría'}</Text>
      <Text style={styles.productDetail}>Stock: {p.cantidad ?? 0}</Text>
      <Text style={styles.productPrice}>
        ${typeof p.precio === 'number' 
          ? p.precio.toLocaleString('es-CO', { minimumFractionDigits: 0 })
          : p.precio ?? '—'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo Público</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.categoryFilterBox}>
          <Text style={styles.categoryFilterTitle}>Categorias</Text>
          <Text style={styles.categoryFilterHint}>Filtra el catalogo por categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoriaSeleccionada || 'Todas'}
              onValueChange={(value) => setCategoriaSeleccionada(value === 'Todas' ? '' : value)}
              style={styles.picker}
              dropdownIconColor="#000000"
              itemStyle={styles.pickerItem}
            >
              {categoriasFiltro.map((cat, idx) => (
                <Picker.Item key={idx} label={cat} value={cat} color="#ffffff" />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.filterLabel}>Buscar por nombre:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#666666"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCategoriaSeleccionada('');
            setTextoBusqueda('');
            if (onBack) onBack();
          }}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productosFiltrados}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos disponibles.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryFilterBox: {
    borderWidth: 2,
    borderColor: '#0F2C54',
    borderRadius: 10,
    backgroundColor: '#eef3fa',
    padding: 10,
    marginBottom: 10,
  },
  categoryFilterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F2C54',
    marginBottom: 2,
  },
  categoryFilterHint: {
    fontSize: 12,
    color: '#4f5d73',
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
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  pickerItem: {
    color: '#ffffff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
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

export default PublicCatalogView;
