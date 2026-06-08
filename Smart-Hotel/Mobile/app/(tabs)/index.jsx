import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Alert,
  Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store'; // <-- IMPORT RAJOUTÉ

import { login } from '../../services/api';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#163B6D',
  secondary: '#0F2744',
  accent: '#73D8E7',
  lightBg: '#F8FAFC',
  gray: '#EEF4F8',
  text: '#10233C',
  textLight: '#64748B',
  gold: '#C9A86A',
  white: '#FFFFFF',
};

export default function LoginScreen() {
  const router = useRouter();
  const { id_tables_transat } = useLocalSearchParams();
  
  const [chambre, setChambre] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  
  const [isRoomFocused, setIsRoomFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);

  const handleLogin = async () => {
    if (!chambre || !motdepasse) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      const data = await login(chambre, motdepasse);
      if (data.token) {
        // <-- SAUVEGARDE DU TOKEN RAJOUTÉE ICI
        await SecureStore.setItemAsync('userToken', data.token);
        
        router.push({
          pathname: '/(tabs)/order',
          params: {
            room: chambre,
            id_client: data.id,
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.heroBackground}
      >
        <View style={styles.overlay}>
          <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.headerContent}>
            <View style={styles.logoBadge}>
 <Image 
  source={require('../../assets/logo.png')} 
  style={styles.logoImage}
  resizeMode="contain"
/>
</View>
            <Text style={styles.title}>BARCELO APP</Text>
            <Text style={styles.subtitle}>Votre service piscine à portée de main</Text>
          </Animated.View>
        </View>
      </ImageBackground>

      <Animated.ScrollView 
        entering={FadeInUp.duration(600).delay(300).springify()}
        style={styles.cardContainer}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
      >
        
        {id_tables_transat && (
          <View style={styles.transatBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
            <Text style={styles.transatText}>Transat n°{id_tables_transat} détecté</Text>
          </View>
        )}

        <Text style={styles.formTitle}>Bienvenue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro de chambre</Text>
          <View style={[styles.inputWrapper, isRoomFocused && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 402"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={chambre}
              onChangeText={setChambre}
              onFocus={() => setIsRoomFocused(true)}
              onBlur={() => setIsRoomFocused(false)}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom de famille</Text>
          <View style={[styles.inputWrapper, isNameFocused && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Nom sur la réservation"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              secureTextEntry={true}
              value={motdepasse}
              onChangeText={setMotdepasse}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} style={styles.loginButtonWrapper}>
          <LinearGradient
            colors={[COLORS.primary, '#2EA7E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Accéder au menu</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.6} 
          onPress={() => router.push('/(tabs)/scan')} 
          style={styles.scanButton}
        >
          <Ionicons name="qr-code-outline" size={18} color={COLORS.textLight} />
          <Text style={styles.scanButtonText}>Scanner mon transat</Text>
        </TouchableOpacity>

        <View style={styles.reassuranceContainer}>
          <View style={styles.reassuranceItem}>
            <View style={styles.reassuranceIconBox}>
              <Ionicons name="umbrella-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.reassuranceText}>Livraison{'\n'}au transat</Text>
          </View>
          <View style={styles.reassuranceItem}>
            <View style={styles.reassuranceIconBox}>
              <Ionicons name="wine-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.reassuranceText}>Service{'\n'}piscine</Text>
          </View>
          <View style={styles.reassuranceItem}>
            <View style={styles.reassuranceIconBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.reassuranceText}>Paiement{'\n'}sécurisé</Text>
          </View>
        </View>

      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightBg },
  heroBackground: { height: height * 0.45, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(22, 59, 109, 0.65)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  headerContent: { alignItems: 'center', marginTop: 40 },
  title: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'sans-serif-medium', fontSize: 28, fontWeight: '800', color: COLORS.white, letterSpacing: 2, marginBottom: 8 },
  logoImage: { 
  width: 70,      // adapte selon la taille voulue
  height: 70, 
  marginBottom: 16,
},
  subtitle: { fontSize: 15, color: COLORS.gray, fontWeight: '400', letterSpacing: 0.5 },
  cardContainer: { flex: 1, backgroundColor: COLORS.white, marginTop: -40, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 10 },
  cardContent: { padding: 32, paddingBottom: 60 },
  transatBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(201, 168, 106, 0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(201, 168, 106, 0.3)' },
  transatText: { color: COLORS.gold, fontWeight: '600', fontSize: 13, marginLeft: 6 },
  formTitle: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 28 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textLight, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { backgroundColor: COLORS.gray, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent', overflow: 'hidden' },
  inputWrapperFocused: { backgroundColor: COLORS.white, borderColor: COLORS.accent, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  input: { height: 56, paddingHorizontal: 20, fontSize: 16, color: COLORS.text, fontWeight: '500' },
  loginButtonWrapper: { marginTop: 12, borderRadius: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6 },
  loginButton: { height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: COLORS.white, fontSize: 17, fontWeight: '700', marginRight: 10, letterSpacing: 0.5 },
  scanButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingVertical: 12 },
  scanButtonText: { color: COLORS.textLight, fontSize: 15, fontWeight: '600', marginLeft: 8 },
  reassuranceContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, paddingTop: 30, borderTopWidth: 1, borderTopColor: COLORS.gray },
  reassuranceItem: { alignItems: 'center', flex: 1 },
  reassuranceIconBox: { width: 44, height: 44, backgroundColor: COLORS.gray, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  reassuranceText: { fontSize: 11, color: COLORS.textLight, textAlign: 'center', fontWeight: '500', lineHeight: 16 },
});