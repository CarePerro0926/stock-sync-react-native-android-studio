// src/components/Admin/UpdateTab.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../services/supabaseClient';

const UpdateTab = ({ 
  productos = [], 
  categorias = [], 
  proveedores = [], 
  onUpdateSuccess 
}) => {
  // Estado para productos
  const [busqueda, setBusqueda] = useState('');
  const [producto, setProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: ''
  });

  // Estado para proveedores
  const [busquedaProv, setBusquedaProv] = useState('');
  const [proveedor, setProveedor] = useState(null);
  const [formProvData, setFormProvData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const normalizar = (valor) => String(valor || '').trim().toLowerCase();

  const proveedoresSugeridos = useMemo(() => {
    const entrada = normalizar(busquedaProv);
    if (!entrada) return [];

    return proveedores
      .filter((pr) => {
        const id = normalizar(pr.id);
        const nombre = normalizar(pr.nombre);
        const email = normalizar(pr.email);
        return id.includes(entrada) || nombre.includes(entrada) || email.includes(entrada);
      })
      .slice(0, 8);
  }, [busquedaProv, proveedores]);

  const seleccionarProveedor = (encontrado) => {
    if (!encontrado) return;
    setProveedor(encontrado);
    setBusquedaProv(String(encontrado.nombre || encontrado.id || ''));
    setFormProvData({
      nombre: encontrado.nombre || '',
      email: encontrado.email || '',
      telefono: encontrado.telefono || '',
      direccion: encontrado.direccion || ''
    });
  };

  // Buscar producto
  const handleBuscar = () => {
    const entrada = (busqueda || '').trim().toLowerCase();
    if (!entrada) {
      Alert.alert('Error', 'Ingresa un ID o nombre para buscar');
      return;
    }

    let encontrado = productos.find(p => String(p.id).toLowerCase() === entrada);
    if (!encontrado) {
      encontrado = productos.find(p => (p.nombre || '').toLowerCase().includes(entrada));
    }

    if (!encontrado) {
      Alert.alert('No encontrado', 'Producto no encontrado');
      setProducto(null);
      setFormData({ nombre: '', precio: '', cantidad: '', categoria: '' });
      return;
    }

    setProducto(encontrado);
    setFormData({
      nombre: encontrado.nombre || '',
      precio: String(encontrado.precio ?? ''),
      cantidad: String(encontrado.cantidad ?? ''),
      categoria: encontrado.categoria_id ?? ''
    });
  };

  // Actualizar producto
  const handleSubmit = async () => {
    if (!producto || !producto.id) {
      Alert.alert('Error', 'Producto no válido. Primero búscalo correctamente.');
      return;
    }

    const precio = parseFloat(formData.precio);
    const cantidad = parseInt(formData.cantidad, 10);

    if (isNaN(precio) || precio < 0) {
      Alert.alert('Error', 'Precio inválido');
      return;
    }
    if (isNaN(cantidad) || cantidad < 0) {
      Alert.alert('Error', 'Cantidad inválida');
      return;
    }

    try {
      const rawId = producto.id;
      const idAsNumber = Number(rawId);
      const id = Number.isNaN(idAsNumber) ? String(rawId).trim() : idAsNumber;
      const payload = {
        nombre: formData.nombre.trim(),
        precio,
        cantidad,
        categoria_id: formData.categoria && String(formData.categoria).trim().length > 0
          ? String(formData.categoria).trim()
          : null
      };

      const { error } = await supabase
        .from('productos')
        .update(payload)
        .eq('id', id)
        .select('id');

      if (error) {
        Alert.alert('Error', 'Error al actualizar el producto: ' + error.message);
        return;
      }

      if (onUpdateSuccess) {
        try { await onUpdateSuccess(); } catch (e) { console.error(e); }
      }

      Alert.alert('Éxito', 'Producto actualizado correctamente');
      setBusqueda('');
      setProducto(null);
      setFormData({ nombre: '', precio: '', cantidad: '', categoria: '' });
    } catch (err) {
      console.error('Error actualizando producto:', err);
      Alert.alert('Error', 'Ocurrió un error al actualizar');
    }
  };

  // Buscar proveedor
  const handleBuscarProveedor = () => {
    const entrada = normalizar(busquedaProv);
    if (!entrada) {
      Alert.alert('Error', 'Ingresa un ID, nombre o email para buscar');
      return;
    }

    const encontrado = proveedores.find((pr) => {
      const id = normalizar(pr.id);
      const nombre = normalizar(pr.nombre);
      const email = normalizar(pr.email);
      return id.includes(entrada) || nombre.includes(entrada) || email.includes(entrada);
    });

    if (!encontrado) {
      Alert.alert('No encontrado', 'Proveedor no encontrado');
      setProveedor(null);
      setFormProvData({ nombre: '', email: '', telefono: '', direccion: '' });
      return;
    }

    seleccionarProveedor(encontrado);
  };

  // Actualizar proveedor
  const handleSubmitProveedor = async () => {
    if (!proveedor || !proveedor.id) {
      Alert.alert('Error', 'Proveedor no válido. Primero búscalo correctamente.');
      return;
    }

    try {
      const { error } = await supabase
        .from('proveedores')
        .update({
          nombre: formProvData.nombre.trim(),
          email: formProvData.email.trim() || null,
          telefono: formProvData.telefono.trim() || null,
          direccion: formProvData.direccion.trim() || null
        })
        .eq('id', proveedor.id);

      if (error) {
        Alert.alert('Error', 'Error al actualizar el proveedor: ' + error.message);
        return;
      }

      if (onUpdateSuccess) {
        try { await onUpdateSuccess(); } catch (e) { console.error(e); }
      }

      Alert.alert('Éxito', 'Proveedor actualizado correctamente');
      setBusquedaProv('');
      setProveedor(null);
      setFormProvData({ nombre: '', email: '', telefono: '', direccion: '' });
    } catch (err) {
      console.error('Error actualizando proveedor:', err);
      Alert.alert('Error', 'Ocurrió un error al actualizar');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sección Productos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actualizar Producto</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Buscar por ID o nombre..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#666666"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleBuscar}>
          <Text style={styles.buttonText}>Buscar Producto</Text>
        </TouchableOpacity>

        {producto && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Editando: {producto.nombre}</Text>
            
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              placeholderTextColor="#666666"
              value={formData.nombre}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
            />

            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              placeholder="Precio"
              placeholderTextColor="#666666"
              value={formData.precio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, precio: text }))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              placeholderTextColor="#666666"
              value={formData.cantidad}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cantidad: text }))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                style={styles.picker}
                dropdownIconColor="#243446"
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Sin categoría" value="" />
                {categorias.map(c => (
                  <Picker.Item key={c.id} label={c.nombre} value={c.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.buttonSuccess} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sección Proveedores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actualizar Proveedor</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Buscar por ID, nombre o email..."
          value={busquedaProv}
          onChangeText={(text) => {
            setBusquedaProv(text);
            if (!text.trim()) {
              setProveedor(null);
              setFormProvData({ nombre: '', email: '', telefono: '', direccion: '' });
            }
          }}
          placeholderTextColor="#666666"
        />

        {busquedaProv.trim() !== '' && proveedoresSugeridos.length > 0 && (
          <View style={styles.sugerenciasContainer}>
            {proveedoresSugeridos.map((pr) => (
              <TouchableOpacity
                key={String(pr.id)}
                style={styles.sugerenciaItem}
                onPress={() => seleccionarProveedor(pr)}
              >
                <Text style={styles.sugerenciaNombre}>{pr.nombre || 'Sin nombre'}</Text>
                <Text style={styles.sugerenciaMeta}>ID: {pr.id} | {pr.email || 'sin email'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleBuscarProveedor}>
          <Text style={styles.buttonText}>Buscar Proveedor</Text>
        </TouchableOpacity>

        {proveedor && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Editando: {proveedor.nombre}</Text>
            
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del proveedor"
              placeholderTextColor="#666666"
              value={formProvData.nombre}
              onChangeText={(text) => setFormProvData(prev => ({ ...prev, nombre: text }))}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              value={formProvData.email}
              onChangeText={(text) => setFormProvData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#666666"
              value={formProvData.telefono}
              onChangeText={(text) => setFormProvData(prev => ({ ...prev, telefono: text }))}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="#666666"
              value={formProvData.direccion}
              onChangeText={(text) => setFormProvData(prev => ({ ...prev, direccion: text }))}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.buttonSuccess} onPress={handleSubmitProveedor}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#243446',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#000000',
  },
  button: {
    backgroundColor: '#0F2C54',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonSuccess: {
    backgroundColor: '#198754',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    color: '#243446',
  },
  pickerItem: {
    color: '#243446',
  },
  sugerenciasContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sugerenciaItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sugerenciaNombre: {
    fontSize: 15,
    color: '#243446',
    fontWeight: '600',
  },
  sugerenciaMeta: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
});

export default UpdateTab;
