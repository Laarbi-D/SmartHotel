import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenu, sendOrder, BASE_URL } from '../../services/api';
const IMAGE_BASE = 'http://100.89.19.78:3000';


const drinkTranslations = {
  'Cola':          { en: 'Cola',           es: 'Cola' },
  'Cuba Libre':    { en: 'Cuba Libre',     es: 'Cuba Libre' },
  'Eau gazeuse':   { en: 'Sparkling water',es: 'Agua con gas' },
  'Gin Tonic':     { en: 'Gin & Tonic',    es: 'Gin Tonic' },
  "Jus d'orange":  { en: 'Orange juice',   es: 'Zumo de naranja' },
  'Long Island':   { en: 'Long Island',    es: 'Long Island' },
  'Mimosa':        { en: 'Mimosa',         es: 'Mimosa' },
  'Thé glacé':     { en: 'Iced tea',       es: 'Té helado' },
};

const i18n = {
  fr: {
    title: 'Carte des boissons', room: 'Chambre',
    ordering: 'Envoi...', success: 'Commande envoyée !',
    successMsg: 'Votre commande arrive bientôt...', error: 'Erreur réseau',
    errorMsg: "Impossible d'envoyer la commande.", logout: 'Déconnexion',
    loading: 'Chargement du menu...', emptyCart: 'Ajoutez au moins une boisson',
    total: 'Total', confirm: 'Confirmer la commande', cartTitle: 'Récapitulatif',
    cancel: 'Annuler', send: 'Envoyer la commande',
  },
  en: {
    title: 'Drinks Menu', room: 'Room',
    ordering: 'Sending...', success: 'Order sent!',
    successMsg: 'Your drinks are on the way...', error: 'Network error',
    errorMsg: 'Could not send the order.', logout: 'Log out',
    loading: 'Loading menu...', emptyCart: 'Add at least one drink',
    total: 'Total', confirm: 'Confirm order', cartTitle: 'Summary',
    cancel: 'Cancel', send: 'Send order',
  },
  es: {
    title: 'Carta de bebidas', room: 'Habitación',
    ordering: 'Enviando...', success: '¡Pedido enviado!',
    successMsg: 'Tus bebidas están en camino...', error: 'Error de red',
    errorMsg: 'No se pudo enviar el pedido.', logout: 'Cerrar sesión',
    loading: 'Cargando menú...', emptyCart: 'Añade al menos una bebida',
    total: 'Total', confirm: 'Confirmar pedido', cartTitle: 'Resumen',
    cancel: 'Cancelar', send: 'Enviar pedido',
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
  const [lang, setLang] = useState('fr');

  const t = i18n[lang];

  const getLabel = (item) => {
    const trad = drinkTranslations[item.nom];
    if (!trad) return item.nom;
    return trad[lang] || item.nom;
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

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const qty = (prev[item.id] || 0) - 1;
      if (qty <= 0) { const next = { ...prev }; delete next[item.id]; return next; }
      return { ...prev, [item.id]: qty };
    });
  };

  const filteredMenu = menu.filter((item) => {
  if (filter === 'alcool') return item.categorie !== 'soft drinks';
  if (filter === 'soft')   return item.categorie === 'soft drinks';
  return true;
});
  const cartItems = menu.filter((item) => cart[item.id] > 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.prix * cart[item.id], 0);

  const handleOrder = async () => {
    if (cartCount === 0) { Alert.alert(t.emptyCart); return; }
    setOrdering(true);
    try {
      const articles = cartItems.map((item) => ({
        id: item.id,
        quantite: cart[item.id],
      }));
      await sendOrder(id_client, articles, id_tables_transat);
      Alert.alert(t.success, t.successMsg);
      setCart({});
      setShowConfirm(false);
    } catch (e) {
      Alert.alert(t.error, t.errorMsg);
    } finally {
      setOrdering(false);
    }
  };

 const renderDrink = ({ item }) => {
  const qty = cart[item.id] || 0;
  const imageUri = item.image ? `${IMAGE_BASE}${item.image}` : null;
  console.log('IMAGE URI:', imageUri); // ← ajoute cette ligne
  return (
    <View style={styles.drinkCard}>
      {imageUri ? (
      <Image
  source={{ uri: imageUri }}
  style={styles.drinkImage}
  resizeMode="contain"
  onError={(e) => console.log('IMG ERROR:', e.nativeEvent.error)}
/>
      ) : (
        <View style={styles.drinkImagePlaceholder} />
      )}
      <View style={styles.drinkInfo}>
        <Text style={styles.drinkName}>{getLabel(item)}</Text>
        <Text style={styles.drinkPrice}>{item.prix} €</Text>
      </View>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item)}>
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyCount}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
  const ConfirmModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{t.cartTitle}</Text>
        {id_tables_transat && (
          <Text style={styles.transatLabel}>🪑 Transat n°{id_tables_transat}</Text>
        )}
        <ScrollView style={{ maxHeight: 250 }}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.modalRow}>
              <Text style={styles.modalItem}>{getLabel(item)} x{cart[item.id]}</Text>
              <Text style={styles.modalPrice}>{(item.prix * cart[item.id]).toFixed(2)} €</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t.total}</Text>
          <Text style={styles.totalAmount}>{cartTotal.toFixed(2)} €</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderBtn, ordering && styles.orderBtnDisabled]}
          onPress={handleOrder} disabled={ordering}
        >
          <Text style={styles.orderBtnText}>{ordering ? t.ordering : t.send}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
          <Text style={styles.cancelText}>{t.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const LangButton = ({ code }) => (
    <TouchableOpacity
      style={[styles.langBtn, lang === code && styles.langBtnActive]}
      onPress={() => setLang(code)}
    >
      <Text style={[styles.langText, lang === code && styles.langTextActive]}>
        {code.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {showConfirm && <ConfirmModal />}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.roomLabel}>{t.room} {room}</Text>
          </View>
        </View>
        <View style={styles.langRow}>
          <LangButton code="fr" />
          <LangButton code="en" />
          <LangButton code="es" />
        </View>
      </View>

      <View style={styles.filterBar}>
        {[
          { key: 'all',    label: 'Tout' },
          { key: 'soft',   label: 'Sans alcool' },
          { key: 'alcool', label: 'Alcoolisé' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDrink}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.orderBtn, cartCount === 0 && styles.orderBtnDisabled]}
          onPress={() => setShowConfirm(true)}
          disabled={cartCount === 0}
        >
          <Text style={styles.orderBtnText}>
            {t.confirm} {cartCount > 0 ? `(${cartCount}) — ${cartTotal.toFixed(2)} €` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#f0f9ff' },
  header:               { flexDirection: 'row', justifyContent: 'space-between',
                          alignItems: 'center', padding: 16, backgroundColor: '#3682ce',
                          borderBottomLeftRadius: 5, borderBottomRightRadius: 5 },
  headerLeft:           { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo:                 { width: 40, height: 40, borderRadius: 8 },
  title:                { fontSize: 16, fontWeight: '700', color: '#fff' },
  roomLabel:            { fontSize: 12, color: '#e0f2fe', marginTop: 2 },
  langRow:              { flexDirection: 'row', gap: 6 },
  langBtn:              { paddingHorizontal: 10, paddingVertical: 5,
                          borderRadius: 8, backgroundColor: '#7dd3fc' },
  langBtnActive:        { backgroundColor: '#fff' },
  langText:             { fontSize: 12, fontWeight: '600', color: '#0369a1' },
  langTextActive:       { color: '#0ea5e9' },
  loader:               { flex: 1, justifyContent: 'center' },
  list:                 { padding: 16, gap: 12 },
  drinkCard:            { flexDirection: 'row', alignItems: 'center', padding: 16,
                          backgroundColor: '#fff', borderRadius: 12,
                          shadowColor: '#000', shadowOpacity: 0.06,
                          shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  drinkImage:           { width: 60, height: 60, borderRadius: 10, marginRight: 14 },
  drinkImagePlaceholder:{ width: 60, height: 60, borderRadius: 10, marginRight: 14,
                          backgroundColor: '#e0f2fe' },
  drinkInfo:            { flex: 1 },
  drinkName:            { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  drinkPrice:           { fontSize: 14, color: '#64748b', marginTop: 2 },
  qtyRow:               { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn:               { width: 32, height: 32, borderRadius: 10, backgroundColor: '#e0f2fe',
                          alignItems: 'center', justifyContent: 'center' },
  qtyBtnText:           { fontSize: 20, fontWeight: '700', color: '#0369a1', lineHeight: 24 },
  qtyCount:             { fontSize: 16, fontWeight: '700', color: '#0f172a',
                          minWidth: 20, textAlign: 'center' },
  footer:               { padding: 20, gap: 10, backgroundColor: '#fff',
                          borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  orderBtn:             { backgroundColor: '#0ea5e9', paddingVertical: 16,
                          borderRadius: 14, alignItems: 'center' },
  orderBtnDisabled:     { backgroundColor: '#bae6fd' },
  orderBtnText:         { color: '#fff', fontSize: 17, fontWeight: '700' },
  logoutBtn:            { alignItems: 'center', paddingVertical: 8 },
  logoutText:           { color: '#94a3b8', fontSize: 13 },
  modalOverlay:         { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center',
                          alignItems: 'center', zIndex: 99, padding: 20 },
  modal:                { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%' },
  modalTitle:           { fontSize: 18, fontWeight: '700', color: '#0f172a',
                          marginBottom: 8, textAlign: 'center' },
  transatLabel:         { textAlign: 'center', color: '#15803d', fontWeight: '600',
                          backgroundColor: '#dcfce7', borderRadius: 8,
                          padding: 6, marginBottom: 12 },
  modalRow:             { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalItem:            { fontSize: 15, color: '#0f172a', flex: 1 },
  modalPrice:           { fontSize: 15, fontWeight: '600', color: '#0369a1' },
  totalRow:             { flexDirection: 'row', justifyContent: 'space-between',
                          borderTopWidth: 1, borderTopColor: '#e2e8f0',
                          paddingTop: 12, marginTop: 8, marginBottom: 16 },
  totalLabel:           { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  totalAmount:          { fontSize: 16, fontWeight: '800', color: '#0ea5e9' },
  cancelBtn:            { alignItems: 'center', paddingVertical: 10 },
  cancelText:           { color: '#94a3b8', fontSize: 14 },
  filterBar:            { flexDirection: 'row', backgroundColor: '#fff', padding: 12,
                          gap: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  filterBtn:            { flex: 1, paddingVertical: 8, borderRadius: 20,
                          backgroundColor: '#f1f5f9', alignItems: 'center' },
  filterBtnActive:      { backgroundColor: '#0ea5e9' },
  filterText:           { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTextActive:     { color: '#fff' },
});