// src/components/UsuariosView.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';

const API_BASE = 'https://stock-sync-api.onrender.com';

const normalizeUser = (u = {}) => ({
  id: String(u.id ?? u.user_id ?? u.userId ?? ''),
  nombres: u.nombres ?? u.first_name ?? u.firstName ?? '',
  apellidos: u.apellidos ?? u.last_name ?? u.lastName ?? '',
  email: u.email ?? '',
  username: u.username ?? u.user_name ?? '',
  cedula: u.cedula ?? u.documento ?? '',
  telefono: u.telefono ?? u.phone ?? '',
  role: u.role ?? u.rol ?? 'cliente',
  deleted_at: u.deleted_at ?? u.deletedAt ?? null,
  disabled: Boolean(u.disabled),
  inactivo: Boolean(u.inactivo),
});

const UsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [reloadFlag, setReloadFlag] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // Cargar usuarios: API primero, fallback Supabase
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);

      try {
        const sessionRaw = await AsyncStorage.getItem('userSession');
        const session = sessionRaw ? JSON.parse(sessionRaw) : null;

        const headers = { 'Content-Type': 'application/json' };
        if (session?.token) {
          headers.Authorization = `Bearer ${session.token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`${API_BASE}/api/usuarios`, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const payload = await res.json().catch(() => null);
        const fromApi = Array.isArray(payload) ? payload : [];

        if (res.ok && fromApi.length > 0) {
          setUsuarios(fromApi.map(normalizeUser));
          setSource('API');
          return;
        }

        // Si API responde vacio o error, intentar Supabase
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .order('nombres', { ascending: true });

        if (error) throw error;

        const fromSupabase = Array.isArray(data) ? data : [];
        setUsuarios(fromSupabase.map(normalizeUser));
        setSource('Supabase');
      } catch (fetchError) {
        console.error('Error cargando usuarios:', fetchError);
        setError(fetchError.message || 'Error al obtener usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [reloadFlag]);

  // Lista de roles para filtro
  const listaRolesFiltro = useMemo(() => {
    const roles = usuarios
      .map(u => u.role)
      .filter(role => role && String(role).trim() !== '');
    const unicos = [...new Set(roles.map(role => String(role).trim()))];
    return ['todos', ...unicos];
  }, [usuarios]);

  // Filtrar usuarios
  const usuariosFiltrados = useMemo(() => {
    const texto = (busqueda || '').toLowerCase().trim();
    return usuarios.filter((u) => {
      const estaInhabilitado = !!(u.deleted_at || u.disabled || u.inactivo);
      
      // Por defecto se muestran todos; el checkbox filtra solo inactivos.
      if (mostrarInactivos && !estaInhabilitado) return false;

      // Filtro por búsqueda
      const coincideBusqueda =
        !texto ||
        (u.nombres?.toLowerCase().includes(texto)) ||
        (u.apellidos?.toLowerCase().includes(texto)) ||
        (u.email?.toLowerCase().includes(texto)) ||
        (u.username?.toLowerCase().includes(texto)) ||
        String(u.cedula ?? '').toLowerCase().includes(texto);

      // Filtro por rol
      const coincideRol = filtroRol === 'todos' || (u.role?.toLowerCase() === filtroRol);

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol, mostrarInactivos]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F2C54" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => setReloadFlag(prev => prev + 1)}
        >
          <Text style={styles.reloadButtonText}>Reintentar carga</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Usuarios Registrados</Text>
        <TouchableOpacity
          style={styles.reloadButtonSmall}
          onPress={() => setReloadFlag(prev => prev + 1)}
        >
          <Text style={styles.reloadButtonTextSmall}>Recargar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sourceText}>Fuente de datos: {source || 'Desconocida'}</Text>

      {/* Checkbox mostrar inactivos */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setMostrarInactivos(!mostrarInactivos)}
      >
        <View style={[styles.checkbox, mostrarInactivos && styles.checkboxChecked]}>
          {mostrarInactivos && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Solo inactivos</Text>
      </TouchableOpacity>

      {/* Filtros */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre, correo, usuario o cédula..."
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#666666"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filtroRol}
          onValueChange={setFiltroRol}
          style={styles.picker}
        >
          <Picker.Item label="Todos los roles" value="todos" />
          {listaRolesFiltro.filter(rol => rol !== 'todos').map((rol, index) => (
            <Picker.Item 
              key={`${rol}-${index}`} 
              label={rol.charAt(0).toUpperCase() + rol.slice(1)} 
              value={rol} 
            />
          ))}
        </Picker>
      </View>

      {/* Lista de usuarios */}
      <ScrollView style={styles.listContainer}>
        {usuariosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        ) : (
          usuariosFiltrados.map(u => (
            <View key={u.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {u.nombres && u.apellidos 
                    ? `${u.nombres} ${u.apellidos}` 
                    : u.username || u.email || `ID: ${u.id}`}
                </Text>
                <View style={[
                  styles.badge,
                  u.deleted_at ? styles.badgeInactivo : styles.badgeActivo
                ]}>
                  <Text style={styles.badgeText}>
                    {u.deleted_at ? 'Inactivo' : 'Activo'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{u.email || '—'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Usuario:</Text>
                <Text style={styles.value}>{u.username || '—'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Cédula:</Text>
                <Text style={styles.value}>{u.cedula || '—'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Rol:</Text>
                <Text style={styles.valueRol}>
                  {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : '—'}
                </Text>
              </View>

              {u.telefono && (
                <View style={styles.row}>
                  <Text style={styles.label}>Teléfono:</Text>
                  <Text style={styles.value}>{u.telefono}</Text>
                </View>
              )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#243446',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sourceText: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 12,
  },
  reloadButton: {
    backgroundColor: '#0F2C54',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reloadButtonSmall: {
    backgroundColor: '#243446',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reloadButtonTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#000000',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243446',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeActivo: {
    backgroundColor: '#d1e7dd',
  },
  badgeInactivo: {
    backgroundColor: '#f8d7da',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    color: '#212529',
    flex: 0.6,
    textAlign: 'right',
  },
  valueRol: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: 'bold',
    flex: 0.6,
    textAlign: 'right',
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

export default UsuariosView;
