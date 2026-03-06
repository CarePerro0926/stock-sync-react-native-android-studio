// src/components/Admin/AddTab.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';

const AddTab = ({
  onAddProducto,
  onAddCategoria,
  onAddProveedor,
  proveedores = [],
  categorias = [],
  productos = []
}) => {
  const [nuevoProducto, setNuevoProducto] = useState({
    id: '',
    nombre: '',
    categoria: '',
    cantidad: '',
    precio: ''
  });

  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleProductoChange = (name, value) => {
    setNuevoProducto(prev => ({
      ...prev,
      [name]: ['cantidad', 'precio'].includes(name) && value !== ''
        ? Number(value)
        : value
    }));
  };

  const handleAddProductoSubmit = () => {
    const { id, nombre, categoria, cantidad, precio } = nuevoProducto;

    if (!id || !nombre || !categoria || cantidad === '' || precio === '') {
      Alert.alert('Error', 'Por favor completa todos los campos del producto');
      return;
    }

    if (onAddProducto) {
      onAddProducto(nuevoProducto);
    }

    setNuevoProducto({
      id: '',
      nombre: '',
      categoria: '',
      cantidad: '',
      precio: ''
    });
    
    Alert.alert('Éxito', 'Producto agregado correctamente');
  };

  const handleAddCategoriaSubmit = () => {
    if (!nuevaCategoria.trim()) {
      Alert.alert('Error', 'Ingresa el nombre de la categoría');
      return;
    }
    
    if (onAddCategoria) {
      onAddCategoria(nuevaCategoria.trim());
    }
    
    setNuevaCategoria('');
    Alert.alert('Éxito', 'Categoría agregada correctamente');
  };

  const handleProveedorChange = (name, value) => {
    setNuevoProveedor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProveedorSubmit = () => {
    const { nombre, email, telefono } = nuevoProveedor;

    if (!nombre || !email) {
      Alert.alert('Error', 'Por favor completa nombre y email del proveedor');
      return;
    }

    if (onAddProveedor) {
      onAddProveedor(nuevoProveedor);
    }

    setNuevoProveedor({
      nombre: '',
      email: '',
      telefono: ''
    });
    
    Alert.alert('Éxito', 'Proveedor agregado correctamente');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sección Agregar Producto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agregar Producto</Text>
        
        <TextInput
          style={styles.input}
          placeholder="ID del producto"
          value={nuevoProducto.id}
          onChangeText={(text) => handleProductoChange('id', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          value={nuevoProducto.nombre}
          onChangeText={(text) => handleProductoChange('nombre', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChangeText={(text) => handleProductoChange('categoria', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={nuevoProducto.cantidad.toString()}
          onChangeText={(text) => handleProductoChange('cantidad', text)}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={nuevoProducto.precio.toString()}
          onChangeText={(text) => handleProductoChange('precio', text)}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAddProductoSubmit}>
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Agregar Categoría */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agregar Categoría</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre de la categoría"
          value={nuevaCategoria}
          onChangeText={setNuevaCategoria}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAddCategoriaSubmit}>
          <Text style={styles.buttonText}>Agregar Categoría</Text>
        </TouchableOpacity>
      </View>

      {/* Sección Agregar Proveedor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agregar Proveedor</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre del proveedor"
          value={nuevoProveedor.nombre}
          onChangeText={(text) => handleProveedorChange('nombre', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={nuevoProveedor.email}
          onChangeText={(text) => handleProveedorChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={nuevoProveedor.telefono}
          onChangeText={(text) => handleProveedorChange('telefono', text)}
          keyboardType="phone-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAddProveedorSubmit}>
          <Text style={styles.buttonText}>Agregar Proveedor</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTab;
