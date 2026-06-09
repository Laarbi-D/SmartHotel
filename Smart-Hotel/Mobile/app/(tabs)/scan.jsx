import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ImageBackground,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- PALETTE PREMIUM ---
const COLORS = {
  primary: '#163B6D',
  secondary: '#0F2744',
  accent: '#73D8E7',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  gold: '#C9A86A',
  textMain: '#10233C',
  textLight: '#EEF4F8',
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const scanned = useRef(false);

  // Animation de la ligne de scan
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    // Lance l'animation de balayage (aller-retour de 0 à 250px)
    scanLineY.value = withRepeat(
      withTiming(250, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  // --- LOGIQUE METIER INTACTE ---
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, []);

  const handleDeepLink = (url) => {
    const { queryParams } = Linking.parse(url);
    const transat = queryParams?.transat ?? queryParams?.table;
    if (!transat) return;
    router.replace({ pathname: '/(tabs)/', params: { id_tables_transat: String(transat) } });
  };

  const handleScan = ({ data }) => {
    if (scanned.current) return;
    scanned.current = true;
    try {
      const { queryParams } = Linking.parse(data);
      const transat = queryParams?.transat ?? queryParams?.table;
      if (transat) {
        router.replace({ pathname: '/(tabs)/', params: { id_tables_transat: String(transat) } });
        return;
      }
    } catch (_) {}

    const id = parseInt(data);
    if (!isNaN(id)) {
      router.replace({ pathname: '/(tabs)/', params: { id_tables_transat: String(id) } });
    }
  };

  const handleManualEntry = () => {
    // Redirige vers la page d'accueil (login) sans transat, ou ouvre une modale de saisie
    router.replace('/(tabs)/');
  };

  // --- RENDU PERMISSIONS //
  if (!permission) return <View style={styles.loadingContainer} />;

  if (!permission.granted) {
    return (
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000' }} style={styles.fullBg}>
        <View style={styles.overlayDark}>
          <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.permissionCard}>
            <Ionicons name="camera-outline" size={48} color={COLORS.primary} style={styles.permissionIcon} />
            <Text style={styles.permissionTitle}>Accès Caméra</Text>
            <Text style={styles.permissionText}>L'accès à votre caméra est nécessaire pour identifier votre transat et vous servir.</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={requestPermission}>
              <LinearGradient colors={[COLORS.primary, '#2EA7E0']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.permissionBtn}>
                <Text style={styles.permissionBtnText}>Autoriser la caméra</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    );
  }

  // --- RENDU SCANNER Premium //
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop' }} 
      style={styles.fullBg}
    >
      <View style={styles.overlayNuit}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* HEADER PREMIUM */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
           <View style={styles.headerCenter}>
  <Image
    source={require('../../assets/logo.png')}
    style={styles.logoTiny}
    resizeMode="contain"
  />
  <Text style={styles.headerTitle}>Scanner votre transat</Text>
  <Text style={styles.headerSub}>Retrouvez automatiquement votre emplacement</Text>
</View>
            <View style={{ width: 40 }} /> {/* Spacer pour centrer */}
          </Animated.View>

          {/* ZONE DE SCAN CENTRALE */}
          <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.scannerWrapper}>
            <View style={styles.scannerFrame}>
              <CameraView 
                style={styles.camera} 
                facing="back" 
                onBarcodeScanned={handleScan} 
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }} 
              />
              
              {/* Overlay Glassmorphism & Cadre */}
              <View style={styles.cameraOverlay}>
                {/* Coins lumineux (Repères) */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Ligne animée du scanner */}
                <Animated.View style={[styles.scanLine, animatedLineStyle]} />
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionMain}>Placez le QR Code à l'intérieur du cadre</Text>
              <Text style={styles.instructionSub}>Le numéro sera détecté automatiquement</Text>
            </View>
          </Animated.View>

          {/* BÉNÉFICES & ACTION SECONDAIRE */}
          <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} style={styles.bottomSection}>
            
            <View style={styles.benefitsRow}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}><Ionicons name="location-outline" size={18} color={COLORS.gold} /></View>
                <Text style={styles.benefitText}>Accès{'\n'}instantané</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}><Ionicons name="wine-outline" size={18} color={COLORS.gold} /></View>
                <Text style={styles.benefitText}>Commandes{'\n'}associées</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIconBox}><Ionicons name="shield-checkmark-outline" size={18} color={COLORS.gold} /></View>
                <Text style={styles.benefitText}>Scan{'\n'}sécurisé</Text>
              </View>
            </View>

            <View style={styles.alternativeContainer}>
              <Text style={styles.alternativeText}>Impossible de scanner ?</Text>
              <TouchableOpacity style={styles.manualBtn} onPress={handleManualEntry}>
                <Text style={styles.manualBtnText}>Entrer le numéro manuellement</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>

        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBg: { flex: 1, width: '100%', height: '100%' },
  overlayNuit: { flex: 1, backgroundColor: 'rgba(15, 39, 68, 0.85)', justifyContent: 'space-between' },
  overlayDark: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  loadingContainer: { flex: 1, backgroundColor: COLORS.secondary },
  
  // Permissions
  permissionCard: { backgroundColor: COLORS.surface, borderRadius: 32, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  permissionIcon: { marginBottom: 16 },
  permissionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textMain, marginBottom: 12 },
  permissionText: { fontSize: 15, color: COLORS.textLight, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  permissionBtn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20 },
  permissionBtnText: { color: COLORS.surface, fontWeight: '700', fontSize: 16 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { alignItems: 'center', flex: 1 },
  logoTiny: { width: 48, height: 48, marginBottom: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.surface, letterSpacing: 0.5 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Scanner
  scannerWrapper: { alignItems: 'center', marginTop: 20 },
  scannerFrame: { width: width * 0.75, height: width * 0.75, borderRadius: 32, overflow: 'hidden', position: 'relative', shadowColor: COLORS.accent, shadowOpacity: 0.3, shadowRadius: 30, elevation: 15 },
  camera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, borderWidth: 2, borderColor: 'rgba(115, 216, 231, 0.1)' },
  scanLine: { width: '100%', height: 3, backgroundColor: COLORS.accent, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  
  // Coins
  corner: { position: 'absolute', width: 40, height: 40, borderColor: COLORS.accent, borderWidth: 4 },
  topLeft: { top: 20, left: 20, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 16 },
  topRight: { top: 20, right: 20, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 20, left: 20, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 20, right: 20, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 16 },

  // Instructions
  instructionsContainer: { alignItems: 'center', marginTop: 32, paddingHorizontal: 20 },
  instructionMain: { fontSize: 16, fontWeight: '700', color: COLORS.surface, textAlign: 'center', marginBottom: 6 },
  instructionSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Bottom Section
  bottomSection: { backgroundColor: COLORS.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, alignItems: 'center' },
  benefitsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 32 },
  benefitItem: { alignItems: 'center', flex: 1 },
  benefitIconBox: { width: 44, height: 44, borderRadius: 16, backgroundColor: 'rgba(201, 168, 106, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  benefitText: { fontSize: 11, color: COLORS.textMain, textAlign: 'center', fontWeight: '600', lineHeight: 16 },
  
  // Alternative
  alternativeContainer: { alignItems: 'center', width: '100%' },
  alternativeText: { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  manualBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', width: '100%', alignItems: 'center' },
  manualBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});