import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../../services/api';

export default function LoginScreen() {
  const { id_tables_transat } = useLocalSearchParams();
  const [chambre, setChambre] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
  if (!chambre || !motdepasse) {
    Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
    return;
  }
  try {
    const data = await login(chambre, motdepasse);
    if (data.token) { // ✅ vérifie que le token existe
      router.push({
        pathname: '/(tabs)/order',
        params: {
          room: chambre,
          id_client: data.id,        // ✅ data.id (pas data.client.ID_CLIENT)
          id_tables_transat: id_tables_transat || null,
        },
      });  
    } else {
      Alert.alert('Accès refusé', data.error || 'Numéro de chambre ou nom incorrect.');
    }
  } catch (e) {
    Alert.alert('Erreur réseau', 'Vérifiez que le serveur est lancé.');
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Hotel</Text>
      <Text style={styles.subtitle}>Commandez depuis la piscine</Text>

      {id_tables_transat && (
        <View style={styles.tableBadge}>
          <Text style={styles.tableBadgeText}>Transat n°{id_tables_transat} détecté</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Numéro de chambre"
        value={chambre}
        onChangeText={setChambre}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nom de famille"
        value={motdepasse}
        onChangeText={setMotdepasse}
        autoCapitalize="words"
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Accéder au menu 🍹</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.scanBtn}
        onPress={() => router.push('/(tabs)/scan')}
      >
        <Text style={styles.scanBtnText}>📷 Scanner mon transat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, justifyContent: 'center', alignItems: 'center',
                    padding: 24, backgroundColor: '#f0f9ff' },
  title:          { fontSize: 32, fontWeight: '800', color: '#0369a1', marginBottom: 8 },
  subtitle:       { fontSize: 15, color: '#64748b', marginBottom: 24 },
  tableBadge:     { backgroundColor: '#dcfce7', borderRadius: 12, paddingHorizontal: 16,
                    paddingVertical: 8, marginBottom: 24 },
  tableBadgeText: { color: '#15803d', fontWeight: '700', fontSize: 14 },
  input:          { width: '100%', backgroundColor: '#fff', borderWidth: 1,
                    borderColor: '#bae6fd', borderRadius: 12, padding: 16,
                    fontSize: 16, marginBottom: 16 },
  button:         { width: '100%', backgroundColor: '#0ea5e9', padding: 18,
                    borderRadius: 14, alignItems: 'center', marginTop: 8 },
  buttonText:     { color: '#fff', fontSize: 17, fontWeight: '700' },
  scanBtn:        { width: '100%', borderWidth: 2, borderColor: '#0ea5e9',
                    padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  scanBtnText:    { color: '#0ea5e9', fontSize: 16, fontWeight: '600' },
});