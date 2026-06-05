import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const scanned = useRef(false);

  // 🔗 Écoute les deep links:
  // - appmobilenew://scan?transat=1
  // - appmobilenew://scan?table=1
  // - https://IP/scan?transat=1 (avec intentFilter côté Android)
  useEffect(() => {
    // Cas 1 : l'app était fermée et s'ouvre via un lien
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Cas 2 : l'app était déjà ouverte en arrière-plan
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, []);

  const handleDeepLink = (url) => {
    const { queryParams } = Linking.parse(url);

    // On accepte ?transat=1 ou ?table=1
    const transat = queryParams?.transat ?? queryParams?.table;
    if (!transat) return;

    router.replace({
      pathname: '/(tabs)/',
      params: { id_tables_transat: String(transat) },
    });
  };

  // 📷 Scan manuel depuis l'app
  const handleScan = ({ data }) => {
    if (scanned.current) return;
    scanned.current = true;

    // Cas 1 : QR code contient une URL (https://... ou appmobilenew://...)
    try {
      const { queryParams } = Linking.parse(data);
      const transat = queryParams?.transat ?? queryParams?.table;
      if (transat) {
        router.replace({
          pathname: '/(tabs)/',
          params: { id_tables_transat: String(transat) },
        });
        return;
      }
    } catch (_) {
      // on ignore, on passe à l'ancien format
    }

    // Cas 2 : ancien format — le QR code contient juste un nombre
    const id = parseInt(data);
    if (!isNaN(id)) {
      router.replace({
        pathname: '/(tabs)/',
        params: { id_tables_transat: String(id) },
      });
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          L'accès à la caméra est nécessaire pour scanner le QR Code de votre transat.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Scannez le QR Code de votre transat</Text>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <Text style={styles.hint}>Pointez la caméra vers le QR Code du transat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center',
                alignItems: 'center', padding: 24 },
  title:      { fontSize: 18, fontWeight: '700', color: '#fff',
                textAlign: 'center', marginBottom: 24 },
  camera:     { width: '100%', height: 350, borderRadius: 20, overflow: 'hidden' },
  hint:       { fontSize: 14, color: '#94a3b8', marginTop: 16, textAlign: 'center' },
  message:    { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 24 },
  button:     { backgroundColor: '#0ea5e9', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});