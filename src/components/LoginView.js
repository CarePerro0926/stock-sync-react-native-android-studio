// src/components/LoginView.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import { supabase } from '../services/supabaseClient';
import ForgotPasswordModal from './Modals/ForgotPasswordModal';
import logoFondo from '../../assets/logo-fondo.png';

const LoginView = ({ onLogin, onShowRegister, onShowCatalog }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const id = identifier.trim();
      const pwd = password.trim();

      if (!id || !pwd) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      const payload = id.includes('@')
        ? { email: id, password: pwd }
        : { username: id, password: pwd };

      console.log('🔐 Intentando login via API Render...');

      // Intento 1: API de Render con timeout de 10 segundos
      let usr = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch('https://stock-sync-api.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const result = await res.json();
          usr = {
            id: result.user?.id ?? null,
            email: result.user?.email ?? null,
            username: result.user?.username ?? null,
            role: result.user?.role ?? 'cliente', 
            token: result.token ?? null,
          };
          console.log('✅ Login exitoso via API');
        } else {
          throw new Error('API respondió con error');
        }
      } catch (apiErr) {
        console.log('⚠️ API falló, intentando fallback con Supabase directo...');

        // Intento 2: Consulta directa a tabla usuarios en Supabase
        const column = id.includes('@') ? 'email' : 'username';
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq(column, id)
          .maybeSingle();

        if (error || !data) {
          throw new Error('Usuario no encontrado');
        }

        // Verificar contraseña (comparación simple - mejora esto en producción con bcrypt)
        if (data.pass !== pwd) {
          throw new Error('Contraseña incorrecta');
        }

        usr = {
          id: data.id,
          email: data.email,
          username: data.username,
          role: data.role ?? 'cliente',
          token: null,
        };
        console.log('✅ Login exitoso via Supabase fallback');
      }

      if (!usr) {
        throw new Error('No se pudo autenticar');
      }

      onLogin(usr);
    } catch (err) {
      console.error('❌ Error inesperado en login:', err.message);
      Alert.alert('Error', `Error: ${err.message || 'Revisa tu conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={logoFondo}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
          <Text style={styles.title}>Stock-Sync</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Correo o usuario"
            placeholderTextColor="#666666"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.successButton]}
              onPress={onShowRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={onShowCatalog}
            disabled={loading}
          >
            <Text style={styles.linkText}>Ver catálogo público</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => setShowForgotModal(true)}
            disabled={loading}
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
      </View>

      <ForgotPasswordModal
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 44, 84, 0.42)',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#0F2C54',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  primaryButton: {
    backgroundColor: '#0F2C54',
  },
  successButton: {
    backgroundColor: '#198754',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0F2C54',
    fontSize: 15,
    fontWeight: '600',
  },
  forgotButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  forgotText: {
    color: '#0F2C54',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginView;
