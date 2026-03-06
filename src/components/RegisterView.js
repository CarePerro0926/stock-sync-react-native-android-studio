// src/components/RegisterView.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const RegisterView = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    fecha: '',
    telefono: '',
    email: '',
    user: '',
    pass: '',
    role: 'cliente'
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { role, email, user, pass, fecha, telefono, ...rest } = formData;

    if (role === 'administrador' && !email.toLowerCase().endsWith('@stocksync.com')) {
      Alert.alert('Error', 'Los administradores deben registrarse con un correo @stocksync.com');
      return;
    }

    if (Object.values(rest).some(v => !v) || !user || !pass || !email || !fecha || !telefono) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
    if (!fechaValida) {
      Alert.alert('Error', 'Formato de fecha inválido. Usa YYYY-MM-DD');
      return;
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (fecha > hoy) {
      Alert.alert('Error', 'La fecha de nacimiento no puede ser futura.');
      return;
    }

    const cleaned = telefono.replace(/\D/g, '');
    const esValido =
      (cleaned.length === 10 && cleaned.startsWith('3')) ||
      (cleaned.length === 12 && cleaned.startsWith('573'));

    if (!esValido) {
      Alert.alert('Error', 'Teléfono inválido. Usa formato colombiano: 3001234567 o +573001234567');
      return;
    }

    try {
      const response = await fetch('https://stock-sync-api.onrender.com/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      if (!response.ok) {
        Alert.alert('Error', result.message);
        return;
      }

      Alert.alert('Éxito', result.message);
      onShowLogin();
    } catch (error) {
      console.error('Error inesperado:', error);
      Alert.alert('Error', 'Error inesperado. Revisa la consola.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Registro de Usuario</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombres"
            value={formData.nombres}
            onChangeText={(text) => handleChange('nombres', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={formData.apellidos}
            onChangeText={(text) => handleChange('apellidos', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Cédula"
            value={formData.cedula}
            onChangeText={(text) => handleChange('cedula', text)}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
            value={formData.fecha}
            onChangeText={(text) => handleChange('fecha', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono (Ej: 3001234567)"
            value={formData.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Nombre de Usuario"
            value={formData.user}
            onChangeText={(text) => handleChange('user', text)}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={formData.pass}
            onChangeText={(text) => handleChange('pass', text)}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Rol:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'cliente' && styles.roleButtonActive
                ]}
                onPress={() => handleChange('role', 'cliente')}
              >
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'cliente' && styles.roleButtonTextActive
                ]}>
                  Cliente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'administrador' && styles.roleButtonActive
                ]}
                onPress={() => handleChange('role', 'administrador')}
              >
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'administrador' && styles.roleButtonTextActive
                ]}>
                  Administrador
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onShowLogin}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  roleButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterView;
