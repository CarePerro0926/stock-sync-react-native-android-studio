// src/components/ClientView.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePayment } from '../hooks/usePayment';
import PaymentModal from './Modals/PaymentModal';
import ConfirmationModal from './Modals/ConfirmationModal';

const ClientView = ({ productos, categorias, carrito, setCarrito, onLogout }) => {
  const [filtroCat, setFiltroCat] = useState('Todas');
  const [filtroTxt, setFiltroTxt] = useState('');
  const normalizar = (valor) => String(valor ?? '').trim().toLowerCase();

  const cats = useMemo(() => {
    return Array.isArray(categorias) ? categorias : [];
  }, [categorias]);

  const productosConNombreCategoria = useMemo(() => {
    return productos.map(p => {
      if (p.categoria_nombre) return p;
      const categoria = cats.find(c => String(c.id) === String(p.categoria_id));
      return {
        ...p, 
        categoria_nombre: categoria ? categoria.nombre : (p.categoria || 'Sin Categoría')
      };
    });
  }, [productos, cats]);

  const {
    showCreditCardModal,
    showConfirmationModal,
    confirmationData,
    handlePayCard,
    handlePayEfecty,
    handlePayCardConfirm,
    closeModals
  } = usePayment(() => setCarrito([]));

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const categoriasFiltro = useMemo(() => {
    const nombresDesdeCategorias = cats.map(c => c?.nombre).filter(Boolean);
    const nombresDesdeProductos = productosConNombreCategoria.map(p => p?.categoria_nombre).filter(Boolean);
    const unicas = [...new Set([...nombresDesdeCategorias, ...nombresDesdeProductos])];
    return ['Todas', ...unicas];
  }, [cats, productosConNombreCategoria]);

  const productosFiltrados = useMemo(() => {
    return productosConNombreCategoria.filter(p => {
      const coincideCat =
        filtroCat === 'Todas' ||
        normalizar(p.categoria_nombre) === normalizar(filtroCat);
      const coincideTxt = !filtroTxt || p.nombre.toLowerCase().includes(filtroTxt.toLowerCase());
      return coincideCat && coincideTxt;
    });
  }, [productosConNombreCategoria, filtroCat, filtroTxt]);

  const handleQuantityChange = (productoId, precioUnitario) => (text) => {
    const cantidad = parseInt(text) || 0;
    setCarrito(prev => {
      const idx = prev.findIndex(item => item.id === productoId);
      let newCarrito = [...prev];
      if (cantidad > 0) {
        if (idx > -1) {
          newCarrito[idx] = { ...newCarrito[idx], cantidad, precio: precioUnitario * cantidad };
        } else {
          newCarrito.push({ id: productoId, cantidad, precio: precioUnitario * cantidad });
        }
      } else {
        if (idx > -1) newCarrito.splice(idx, 1);
      }
      return newCarrito;
    });
  };

  const renderProducto = ({ item: p }) => {
    const itemCarrito = carrito.find(item => item.id === p.id);
    const cantidadActual = itemCarrito ? itemCarrito.cantidad : 0;

    return (
      <View style={styles.productCard}>
        <Text style={styles.productName}>{p.nombre}</Text>
        <Text style={styles.productDetail}>Categoría: {p.categoria_nombre}</Text>
        <Text style={styles.productDetail}>Stock: {p.cantidad}</Text>
        <Text style={styles.productPrice}>
          ${typeof p.precio === 'number' ? p.precio.toLocaleString('es-CO') : '—'}
        </Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={cantidadActual > 0 ? String(cantidadActual) : ''}
            placeholder="0"
            placeholderTextColor="#666666"
            onChangeText={handleQuantityChange(p.id, p.precio)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vista Cliente</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.categoryFilterBox}>
          <Text style={styles.categoryFilterTitle}>Categorias</Text>
          <Text style={styles.categoryFilterHint}>Filtra productos por categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtroCat}
              onValueChange={(value) => setFiltroCat(value)}
              style={styles.picker}
              dropdownIconColor="#243446"
              itemStyle={styles.pickerItem}
            >
              {categoriasFiltro.map((cat, idx) => (
                <Picker.Item key={idx} label={cat} value={cat} color="#243446" />
              ))}
            </Picker>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#666666"
          value={filtroTxt}
          onChangeText={setFiltroTxt}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos disponibles</Text>}
      />

      <View style={styles.cartContainer}>
        <Text style={styles.totalText}>Total: ${total.toLocaleString('es-CO')}</Text>
        <View style={styles.cartButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.payButton]} 
            onPress={handlePayCard}
            disabled={carrito.length === 0}
          >
            <Text style={styles.buttonText}>Pagar con Tarjeta</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.efectyButton]} 
            onPress={handlePayEfecty}
            disabled={carrito.length === 0}
          >
            <Text style={styles.buttonText}>Pagar con Efecty</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PaymentModal
        visible={showCreditCardModal}
        onClose={closeModals}
        onConfirm={handlePayCardConfirm}
      />

      <ConfirmationModal
        visible={showConfirmationModal}
        title={confirmationData.title}
        body={confirmationData.body}
        onClose={closeModals}
      />
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
    backgroundColor: '#0F2C54',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 12,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    backgroundColor: '#fff',
    height: 50,
    color: '#243446',
  },
  pickerItem: {
    color: '#243446',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1,
    color: '#000000',
  },
  listContent: {
    padding: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#198754',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 14,
    marginRight: 10,
    color: '#333',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 8,
    width: 70,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    color: '#000000',
  },
  cartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#0F2C54',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#212529',
    textAlign: 'center',
  },
  cartButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  payButton: {
    backgroundColor: '#0F2C54',
  },
  efectyButton: {
    backgroundColor: '#ffc107',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default ClientView;
