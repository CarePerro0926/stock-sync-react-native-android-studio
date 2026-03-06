// src/components/Admin/GestionarEstadoTab.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../services/supabaseClient';

const GestionarEstadoTab = ({
  productos = [],
  proveedores = [],
  categorias = [],
  onUpdateSuccess
}) => {
  const [tipoEntidad, setTipoEntidad] = useState('productos');
  const [entidadSeleccionada, setEntidadSeleccionada] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // Obtener lista de entidades según el tipo
  const getEntidades = () => {
    switch (tipoEntidad) {
      case 'productos':
        return productos.filter(p => mostrarInactivos ? p.deleted_at : !p.deleted_at);
      case 'proveedores':
        return proveedores.filter(p => mostrarInactivos ? p.deleted_at : !p.deleted_at);
      case 'categorias':
        return categorias.filter(c => mostrarInactivos ? c.deleted_at : !c.deleted_at);
      default:
        return [];
    }
  };

  const entidades = getEntidades();
  const entidadActual = entidades.find(e => String(e.id) === String(entidadSeleccionada));

  // Cambiar estado (activar/desactivar)
  const handleToggle = async () => {
    if (!entidadSeleccionada || !entidadActual) {
      Alert.alert('Error', 'Selecciona una entidad primero');
      return;
    }

    const estaInactivo = !!entidadActual.deleted_at;
    const accion = estaInactivo ? 'activar' : 'desactivar';
    
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de ${accion} este elemento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const tabla = tipoEntidad === 'productos' ? 'productos' : 
                           tipoEntidad === 'proveedores' ? 'proveedores' : 'categorias';
              
              const payload = estaInactivo ? { deleted_at: null } : { deleted_at: new Date().toISOString() };

              const { error } = await supabase
                .from(tabla)
                .update(payload)
                .eq('id', entidadActual.id);

              if (error) {
                Alert.alert('Error', 'Error al cambiar el estado: ' + error.message);
                return;
              }

              if (onUpdateSuccess) {
                try { await onUpdateSuccess(); } catch (e) { console.error(e); }
              }

              Alert.alert('Éxito', `Elemento ${estaInactivo ? 'activado' : 'desactivado'} correctamente`);
              setEntidadSeleccionada('');
            } catch (err) {
              console.error('Error cambiando estado:', err);
              Alert.alert('Error', 'Ocurrió un error al cambiar el estado');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestionar Estado</Text>
      <Text style={styles.subtitle}>Activa o desactiva productos, proveedores o categorías</Text>

      {/* Selector de tipo de entidad */}
      <Text style={styles.label}>Tipo de entidad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoEntidad}
          onValueChange={(value) => {
            setTipoEntidad(value);
            setEntidadSeleccionada('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Productos" value="productos" />
          <Picker.Item label="Proveedores" value="proveedores" />
          <Picker.Item label="Categorías" value="categorias" />
        </Picker>
      </View>

      {/* Checkbox mostrar inactivos */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => {
          setMostrarInactivos(!mostrarInactivos);
          setEntidadSeleccionada('');
        }}
      >
        <View style={[styles.checkbox, mostrarInactivos && styles.checkboxChecked]}>
          {mostrarInactivos && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Mostrar inactivos</Text>
      </TouchableOpacity>

      {/* Selector de entidad específica */}
      <Text style={styles.label}>Seleccionar elemento</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={entidadSeleccionada}
          onValueChange={setEntidadSeleccionada}
          style={styles.picker}
        >
          <Picker.Item label="-- Selecciona --" value="" />
          {entidades.map(e => (
            <Picker.Item 
              key={e.id} 
              label={`${e.id} - ${e.nombre}`} 
              value={String(e.id)} 
            />
          ))}
        </Picker>
      </View>

      {/* Información de la entidad seleccionada */}
      {entidadActual && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Información</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{entidadActual.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{entidadActual.nombre}</Text>
          </View>
          {tipoEntidad === 'productos' && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Precio:</Text>
                <Text style={styles.infoValue}>
                  ${typeof entidadActual.precio === 'number' ? entidadActual.precio.toLocaleString('es-CO') : '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Stock:</Text>
                <Text style={styles.infoValue}>{entidadActual.cantidad ?? 0}</Text>
              </View>
            </>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={[
              styles.infoValue, 
              entidadActual.deleted_at ? styles.estadoInactivo : styles.estadoActivo
            ]}>
              {entidadActual.deleted_at ? 'Inhabilitado' : 'Activo'}
            </Text>
          </View>

          {/* Botón para cambiar estado */}
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              entidadActual.deleted_at ? styles.buttonActivar : styles.buttonDesactivar
            ]}
            onPress={handleToggle}
          >
            <Text style={styles.buttonText}>
              {entidadActual.deleted_at ? 'Activar' : 'Desactivar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {entidades.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay {tipoEntidad} {mostrarInactivos ? 'inactivos' : 'activos'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#243446',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    marginTop: 12,
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243446',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
  },
  estadoActivo: {
    color: '#198754',
    fontWeight: 'bold',
  },
  estadoInactivo: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonActivar: {
    backgroundColor: '#198754',
  },
  buttonDesactivar: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default GestionarEstadoTab;
