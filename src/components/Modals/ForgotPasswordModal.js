// src/components/Modals/ForgotPasswordModal.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../services/supabaseClient';

const RESET_REDIRECT_URL = 'https://stocksync.com/reset-password';

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [userOrEmail, setUserOrEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    const input = userOrEmail.trim();
    if (!input) {
      Alert.alert('Error', 'Ingresa usuario o correo');
      return;
    }

    setLoading(true);

    try {
      let emailToUse = null;

      if (input.includes('@')) {
        emailToUse = input;
      } else {
        // Prioridad: tabla usuarios de la app (la misma del login)
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('email, username')
          .eq('username', input)
          .maybeSingle();

        if (!usuarioError && usuarioData?.email) {
          emailToUse = usuarioData.email;
        }

        // Fallback: buscar por nickname en tablas alternativas si existe
        if (!emailToUse) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('email, nickname, display_name')
            .or(`nickname.eq.${input},display_name.eq.${input}`)
            .limit(1);

          if (!profileError && Array.isArray(profileData) && profileData[0]?.email) {
            emailToUse = profileData[0].email;
          }
        }
      }

      if (!emailToUse) {
        Alert.alert('No encontrado', 'No se encontró un usuario/correo válido');
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailToUse, {
        redirectTo: RESET_REDIRECT_URL,
      });

      if (resetError) {
        Alert.alert('Error', `No se pudo enviar el correo: ${resetError.message}`);
        return;
      }

      Alert.alert('Listo', 'Correo de recuperación enviado. Revisa tu bandeja de entrada.');
      setUserOrEmail('');
      onClose();
    } catch (err) {
      console.error('ForgotPassword error:', err);
      Alert.alert('Error', 'Ocurrió un error interno al recuperar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Recuperar contraseña</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario o email"
            placeholderTextColor="#666666"
            value={userOrEmail}
            onChangeText={setUserOrEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose} disabled={loading}>
              <Text style={styles.secondaryButtonText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Enviar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F2C54',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0F2C54',
  },
  secondaryButton: {
    backgroundColor: '#e9ecef',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#343a40',
    fontWeight: '700',
  },
});

export default ForgotPasswordModal;
