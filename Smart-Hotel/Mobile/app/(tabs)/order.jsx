import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, ImageBackground,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
  Platform, Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { getMenu, sendOrder } from '../../services/api';

const { width } = Dimensions.get('window');
const IMAGE_BASE = process.env.EXPO_PUBLIC_IMAGE_URL;

const COLORS = {
  primary: '#163B6D',
  secondary: '#0F2744',
  accent: '#73D8E7',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  gold: '#C9A86A',
  textMain: '#10233C',
  textMuted: '#64748B',
  border: '#EEF4F8'
};

const SOFT_CATEGORY = 'soft drinks';

const drinkTranslations = {
  'Cola':          { en: 'Cola',            es: 'Cola' },
  'Cuba Libre':    { en: 'Cuba Libre',      es: 'Cuba Libre' },
  'Eau gazeuse':   { en: 'Sparkling water', es: 'Agua con gas' },
  'Gin Tonic':     { en: 'Gin & Tonic',     es: 'Gin Tonic' },
  "Jus d'orange":  { en: 'Orange juice',    es: 'Zumo de naranja' },
  'Long Island':   { en: 'Long Island',     es: 'Long Island' },
  'Mimosa':        { en: 'Mimosa',          es: 'Mimosa' },
  'Thé glacé':     { en: 'Iced tea',        es: 'Té helado' },
};

const i18n = {
  fr: {
    title: 'Service Piscine', room: 'Chambre',
    ordering: 'Envoi...', success: 'Commande envoyée !',
    successMsg: 'Votre commande arrive bientôt...', error: 'Erreur réseau',
    errorMsg: "Impossible d'envoyer la commande.", logout: 'Déconnexion',
    loading: 'Chargement du menu...', emptyCart: 'Ajoutez au moins une boisson',
    total: 'Total', confirm: 'Commander', cartTitle: 'Récapitulatif',
    cancel: 'Annuler', add: 'Ajouter', send: 'Confirmer la commande',
    heroTitle: 'Détendez-vous.', heroSub: 'Nous vous servons directement au transat.',
    filterAll: 'Toute la carte', filterSoft: 'Softs & Jus', filterAlcool: 'Cocktails & Vins',
    catSoft: 'Sans alcool', catAlcool: 'Alcoolisé'
  },
  en: {
    title: 'Pool Service', room: 'Room',
    ordering: 'Sending...', success: 'Order sent!',
    successMsg: 'Your drinks are on the way...', error: 'Network error',
    errorMsg: 'Could not send the order.', logout: 'Log out',
    loading: 'Loading menu...', emptyCart: 'Add at least one drink',
    total: 'Total', confirm: 'Checkout', cartTitle: 'Summary',
    cancel: 'Cancel', add: 'Add', send: 'Confirm order',
    heroTitle: 'Relax.', heroSub: 'We serve you directly at your sunbed.',
    filterAll: 'Full menu', filterSoft: 'Soft drinks', filterAlcool: 'Cocktails & Wines',
    catSoft: 'Non-alcoholic', catAlcool: 'Alcoholic'
  },
  es: {
    title: 'Servicio de Piscina', room: 'Habitación',
    ordering: 'Enviando...', success: '¡Pedido enviado!',
    successMsg: 'Tus bebidas están en camino...', error: 'Error de red',
    errorMsg: 'No se pudo enviar el pedido.', logout: 'Cerrar sesión',
    loading: 'Cargando menú...', emptyCart: 'Añade al menos una bebida',
    total: 'Total', confirm: 'Pedir', cartTitle: 'Resumen',
    cancel: 'Cancelar', add: 'Añadir', send: 'Confirmar pedido',
    heroTitle: 'Relájese.', heroSub: 'Le servimos directamente en la hamaca.',
    filterAll: 'Carta completa', filterSoft: 'Refrescos', filterAlcool: 'Cócteles & Vinos',
    catSoft: 'Sin alcohol', catAlcool: 'Con alcohol'
  },
};

export default function OrderScreen() {
  const { room, id_client, id_tables_transat } = useLocalSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState('all');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lang, setLang] = useState('fr');

  const t = i18n[lang];

  useEffect(() => {
    if (!id_client) router.replace('/(tabs)/');
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/(tabs)/');
  };

  const getLabel = (item) => {
    const trad = drinkTranslations[item.nom];
    return trad ? (trad[lang] || item.nom) : item.nom;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenu(Array.isArray(data) ? data : []);
      } catch (e) {
        Alert.alert(t.error, t.errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => setCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }));
  const removeFromCart = (item) => {
    setCart(p => {
      const qty = (p[item.id] || 0) - 1;
      if (qty <= 0) { const next = { ...p }; delete next[item.id]; return next; }
      return { ...p, [item.id]: qty };
    });
  };

  const filteredMenu = useMemo(() => menu.filter((item) => {
    if (filter === 'alcool') return item.categorie !== SOFT_CATEGORY;
    if (filter === 'soft') return item.categorie === SOFT_CATEGORY;
    return true;
  }), [menu, filter]);

  const cartItems = menu.filter(item => cart[item.id] > 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.prix * cart[item.id], 0);

  const handleOrder = async () => {
    if (cartCount === 0) { Alert.alert(t.emptyCart); return; }
    setOrdering(true);
    try {
      const articles = cartItems.map(item => ({ id: item.id, quantite: cart[item.id] }));
      await sendOrder(id_client, articles, id_tables_transat);
      setCart({});
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      Alert.alert(t.error, t.errorMsg);
    } finally {
      setOrdering(false);
    }
  };

  // --- COMPOSANTS UI ---

  const SuccessBanner = () => (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.successBanner}>
      <View style={styles.successIconCircle}>
        <Ionicons name="checkmark" size={28} color={COLORS.surface} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.successTitle}>{t.success}</Text>
        <Text style={styles.successSub}>{t.successMsg}</Text>
      </View>
    </Animated.View>
  );

  const ConfirmModal = () => (
    <View style={styles.modalOverlay}>
      <Animated.View entering={ZoomIn.duration(300)} style={styles.modal}>
        <Text style={styles.modalTitle}>{t.cartTitle}</Text>
        {id_tables_transat && (
          <View style={styles.transatBadgeLarge}>
            <Ionicons name="location-outline" size={16} color={COLORS.gold} />
            <Text style={styles.transatLabelLarge}>Livraison au Transat n°{id_tables_transat}</Text>
          </View>
        )}
        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.modalRow}>
              <View>
                <Text style={styles.modalItem}>{getLabel(item)}</Text>
                <Text style={styles.modalItemQty}>Qté: {cart[item.id]}</Text>
              </View>
              <Text style={styles.modalPrice}>{(item.prix * cart[item.id]).toFixed(2)} €</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t.total}</Text>
          <Text style={styles.totalAmount}>{cartTotal.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={handleOrder} disabled={ordering}>
          <LinearGradient colors={[COLORS.primary, '#2EA7E0']} start={{ x:0, y:0 }} end={{ x:1, y:0 }} style={styles.modalBtn}>
            <Text style={styles.modalBtnText}>{ordering ? t.ordering : t.send}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
          <Text style={styles.cancelText}>{t.cancel}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const LangButton = ({ code }) => (
    <TouchableOpacity style={[styles.langBtn, lang === code && styles.langBtnActive]} onPress={() => setLang(code)}>
      <Text style={[styles.langText, lang === code && styles.langTextActive]}>{code.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  const renderDrink = ({ item, index }) => {
    const qty = cart[item.id] || 0;
    const imageUri = item.image ? `${IMAGE_BASE}${item.image}` : null;
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <View style={styles.card}>
          <View style={styles.cardImgContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.cardImg} resizeMode="cover" />
            ) : (
              <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
                <Ionicons name="wine-outline" size={24} color={COLORS.textMuted} />
              </View>
            )}
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{Number(item.prix).toFixed(2)} €</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{getLabel(item)}</Text>
            <Text style={styles.cardCategory}>
              {item.categorie === SOFT_CATEGORY ? t.catSoft : t.catAlcool}
            </Text>
            <View style={styles.qtyContainer}>
              {qty === 0 ? (
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                  <Ionicons name="add" size={18} color={COLORS.primary} />
                  <Text style={styles.addBtnText}>{t.add}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyStepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => removeFromCart(item)}>
                    <Ionicons name="remove" size={18} color={COLORS.textMain} />
                  </TouchableOpacity>
                  <Text style={styles.stepperValue}>{qty}</Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => addToCart(item)}>
                    <Ionicons name="add" size={18} color={COLORS.textMain} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {showSuccess && <SuccessBanner />}
      {showConfirm && <ConfirmModal />}

      {/* HEADER & HERO */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.heroBg}
      >
        <LinearGradient colors={['rgba(22, 59, 109, 0.9)', 'rgba(22, 59, 109, 0.6)']} style={styles.heroOverlay}>
          <SafeAreaView edges={['top', 'left', 'right']}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logoTiny}
                  resizeMode="contain"
                />
                <Text style={styles.roomText}>{t.room} {room}</Text>
              </View>
              <View style={styles.langRow}>
                <LangButton code="fr" /><LangButton code="en" /><LangButton code="es" />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutIconBtn}>
                  <Ionicons name="log-out-outline" size={20} color={COLORS.surface} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>{t.heroTitle}</Text>
              <Text style={styles.heroSub}>{t.heroSub}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      {/* FILTRES */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { key: 'all', label: t.filterAll },
            { key: 'soft', label: t.filterSoft },
            { key: 'alcool', label: t.filterAlcool }
          ].map(f => (
            <TouchableOpacity key={f.key} onPress={() => setFilter(f.key)} style={[styles.filterCapsule, filter === f.key && styles.filterCapsuleActive]}>
              <Text style={[styles.filterCapsuleText, filter === f.key && styles.filterCapsuleTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LISTE */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDrink}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* PANIER FLOTTANT */}
      {cartCount > 0 && (
        <Animated.View entering={FadeInDown.springify()} style={styles.floatingCartWrap}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setShowConfirm(true)}>
            <LinearGradient colors={[COLORS.primary, '#2EA7E0']} start={{ x:0, y:0 }} end={{ x:1, y:0 }} style={styles.floatingCart}>
              <View style={styles.cartInfo}>
                <View style={styles.cartCountBadge}>
                  <Text style={styles.cartCountText}>{cartCount}</Text>
                </View>
                <Text style={styles.cartTotalText}>{cartTotal.toFixed(2)} €</Text>
              </View>
              <View style={styles.cartAction}>
                <Text style={styles.cartActionText}>{t.confirm}</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.surface} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroBg: { width: '100%', height: Platform.OS === 'ios' ? 240 : 220 },
  heroOverlay: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoTiny: { width: 44, height: 44 },
  roomText: { fontSize: 16, color: COLORS.surface, fontWeight: '700' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', padding: 4, borderRadius: 20 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  langBtnActive: { backgroundColor: COLORS.surface },
  langText: { fontSize: 11, fontWeight: '700', color: COLORS.surface },
  langTextActive: { color: COLORS.primary },
  logoutIconBtn: { padding: 6, marginLeft: 4 },
  heroTextContainer: { marginTop: 30 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: COLORS.surface, letterSpacing: -0.5 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 8 },
  filterWrapper: { backgroundColor: COLORS.bg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterScroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  filterCapsule: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterCapsuleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterCapsuleText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  filterCapsuleTextActive: { color: COLORS.surface },
  loader: { flex: 1, justifyContent: 'center' },
  listContent: { padding: 20, paddingBottom: 120, gap: 16 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 24, padding: 12, shadowColor: COLORS.primary, shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  cardImgContainer: { position: 'relative' },
  cardImg: { width: 90, height: 90, borderRadius: 16 },
  cardImgPlaceholder: { backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  priceBadge: { position: 'absolute', bottom: -8, left: 10, backgroundColor: COLORS.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  priceText: { fontSize: 12, fontWeight: '800', color: COLORS.textMain },
  cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textMain, marginBottom: 4 },
  cardCategory: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
  qtyContainer: { alignSelf: 'flex-start' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, gap: 4 },
  addBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  qtyStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  stepperBtn: { padding: 8, paddingHorizontal: 12 },
  stepperValue: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, minWidth: 24, textAlign: 'center' },
  floatingCartWrap: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  floatingCart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 24, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  cartInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartCountBadge: { backgroundColor: 'rgba(255,255,255,0.2)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cartCountText: { color: COLORS.surface, fontWeight: '800', fontSize: 15 },
  cartTotalText: { color: COLORS.surface, fontWeight: '700', fontSize: 18 },
  cartAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cartActionText: { color: COLORS.surface, fontWeight: '600', fontSize: 15 },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 39, 68, 0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 99, padding: 20 },
  modal: { backgroundColor: COLORS.surface, borderRadius: 32, padding: 24, width: '100%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 30, elevation: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textMain, marginBottom: 16, textAlign: 'center' },
  transatBadgeLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(201, 168, 106, 0.1)', padding: 12, borderRadius: 16, marginBottom: 20 },
  transatLabelLarge: { color: COLORS.gold, fontWeight: '700', fontSize: 14, marginLeft: 8 },
  modalScroll: { maxHeight: 250 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalItem: { fontSize: 16, fontWeight: '600', color: COLORS.textMain },
  modalItemQty: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  modalPrice: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16, marginTop: 8, marginBottom: 24 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textMuted },
  totalAmount: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  modalBtn: { borderRadius: 20, paddingVertical: 18, alignItems: 'center' },
  modalBtnText: { color: COLORS.surface, fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  cancelText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
  // --- SUCCESS BANNER ---
  successBanner: {
    position: 'absolute', top: 60, left: 20, right: 20, zIndex: 100,
    backgroundColor: '#1A9E5C', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  successIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  successTitle: { fontSize: 16, fontWeight: '800', color: COLORS.surface, marginBottom: 2 },
  successSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
});