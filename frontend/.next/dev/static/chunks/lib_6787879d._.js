(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // --- AJOUTER UN PRODUIT ---
    const addItem = (drink, quantity, notes)=>{
        setItems((prev)=>{
            // On vérifie si le produit existe via ID_PRODUIT (colonne MySQL)
            const existing = prev.find((item)=>item.drink.ID_PRODUIT === drink.ID_PRODUIT);
            if (existing) {
                return prev.map((item)=>item.drink.ID_PRODUIT === drink.ID_PRODUIT ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        notes
                    } : item);
            }
            return [
                ...prev,
                {
                    drink,
                    quantity,
                    notes
                }
            ];
        });
    };
    // --- SUPPRIMER UN PRODUIT ---
    const removeItem = (drinkId)=>{
        setItems((prev)=>prev.filter((item)=>item.drink.ID_PRODUIT !== drinkId));
    };
    // --- METTRE À JOUR LA QUANTITÉ ---
    const updateQuantity = (drinkId, quantity)=>{
        if (quantity <= 0) {
            removeItem(drinkId);
            return;
        }
        setItems((prev)=>prev.map((item)=>item.drink.ID_PRODUIT === drinkId ? {
                    ...item,
                    quantity
                } : item));
    };
    // --- VIDER LE PANIER ---
    const clearCart = ()=>setItems([]);
    // --- CALCULS DU PANIER (Adapté à MySQL) ---
    const totalItems = items.reduce((sum, item)=>sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item)=>{
        // On force le prix MySQL en nombre pour éviter les erreurs "NaN"
        const price = parseFloat(item.drink.PRIX_PRODUITS) || 0;
        return sum + price * item.quantity;
    }, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/cart-context.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "6WAym07vHedVzpAy8bFDJKqtv8I=");
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/translation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "translations",
    ()=>translations
]);
const translations = {
    fr: {
        hero: {
            titlePart1: "Commandez votre boisson.",
            titlePart2: "Détendez-vous.",
            subtitle: "Boissons premium livrées directement à votre transat, chambre ou salon.",
            orderButton: "Commander",
            menuButton: "Voir le menu",
            stars: "Service Cinq Étoiles"
        },
        menu: {
            title: "Notre Sélection",
            subtitle: "Directement du bar à vous",
            loading: "Connexion au serveur...",
            error: "Erreur Serveur",
            noDrinks: "Aucune boisson trouvée dans"
        },
        categories: {
            cocktails: "Cocktails",
            softs: "Softs",
            beers: "Bières",
            wines: "Vins"
        },
        cart: {
            title: "Votre Commande",
            empty: "Votre panier est vide",
            confirm: "Confirmer la commande",
            specialRequests: "Demandes spéciales",
            specialPlaceholder: "Moins de glaçons, citron en plus...",
            addOrder: "Ajouter à la commande"
        },
        confirmation: {
            title: "Votre boisson arrive",
            subtitle: "Détendez-vous. Notre équipe vous apportera votre commande sous peu.",
            deliveringTo: "Livraison à la",
            button: "Commander d'autres boissons"
        },
        auth: {
            welcome: "Bienvenue",
            instruction: "Connectez-vous pour commander vos boissons",
            labelName: "Nom du client",
            placeholderName: "Entrez votre nom",
            labelRoom: "Numéro de chambre",
            placeholderRoom: "ex: 301",
            button: "Continuer",
            assistance: "Besoin d'aide ? Contactez la réception",
            errorName: "Veuillez entrer votre nom",
            errorRoom: "Veuillez entrer votre numéro de chambre",
            errorNotFound: "Client non trouvé. Vérifiez vos informations.",
            errorServer: "Erreur serveur. Veuillez réessayer plus tard."
        },
        common: {
            quantity: "Quantité",
            price: "Prix",
            total: "Montant Total"
        }
    },
    en: {
        hero: {
            titlePart1: "Order Your Drink.",
            titlePart2: "Relax.",
            subtitle: "Premium drinks delivered directly to your sunbed, room, or lounge.",
            orderButton: "Order a drink",
            menuButton: "View menu",
            stars: "Five Star Service"
        },
        menu: {
            title: "Our Selection",
            subtitle: "Directly from the bar to you",
            loading: "Connecting to server...",
            error: "Server Error",
            noDrinks: "No drinks found in"
        },
        categories: {
            cocktails: "Cocktails",
            softs: "Soft Drinks",
            beers: "Beers",
            wines: "Wines"
        },
        cart: {
            title: "Your Order",
            empty: "Your basket is empty",
            confirm: "Confirm Order",
            specialRequests: "Special requests",
            specialPlaceholder: "Less ice, extra lemon...",
            addOrder: "Add to order"
        },
        confirmation: {
            title: "Your drink is on the way",
            subtitle: "Sit back and relax. Our staff will bring your order shortly.",
            deliveringTo: "Delivering to",
            button: "Order more drinks"
        },
        auth: {
            welcome: "Welcome",
            instruction: "Sign in to order drinks from your sunbed",
            labelName: "Guest Name",
            placeholderName: "Enter your name",
            labelRoom: "Room Number",
            placeholderRoom: "e.g. 301",
            button: "Continue",
            assistance: "Need assistance? Contact the front desk",
            errorName: "Please enter your name",
            errorRoom: "Please enter your room number",
            errorNotFound: "Guest not found. Please check your details.",
            errorServer: "Server error. Please try again later."
        },
        common: {
            quantity: "Quantity",
            price: "Price",
            total: "Total Amount"
        }
    },
    es: {
        hero: {
            titlePart1: "Pide tu bebida.",
            titlePart2: "Relájate.",
            subtitle: "Bebidas premium entregadas directamente en tu tumbona, habitación o salón.",
            orderButton: "Pedir bebida",
            menuButton: "Ver menú",
            stars: "Servicio de Cinco Estrellas"
        },
        menu: {
            title: "Nuestra Selección",
            subtitle: "Directamente de la barra para ti",
            loading: "Conectando al servidor...",
            error: "Error del servidor",
            noDrinks: "No se encontraron bebidas en"
        },
        categories: {
            cocktails: "Cócteles",
            softs: "Refrescos",
            beers: "Cervezas",
            wines: "Vinos"
        },
        cart: {
            title: "Tu Pedido",
            empty: "Tu cesta está vacía",
            confirm: "Confirmar Pedido",
            specialRequests: "Peticiones especiales",
            specialPlaceholder: "Menos hielo, más limón...",
            addOrder: "Añadir al pedido"
        },
        confirmation: {
            title: "Tu bebida está en camino",
            subtitle: "Relájate. Nuestro equipo te traerá tu pedido en breve.",
            deliveringTo: "Entregando en la",
            button: "Pedir más bebidas"
        },
        auth: {
            welcome: "Bienvenido",
            instruction: "Inicia sesión para pedir bebidas desde tu tumbona",
            labelName: "Nombre del huésped",
            placeholderName: "Introduce tu nombre",
            labelRoom: "Número de habitación",
            placeholderRoom: "ej: 301",
            button: "Continuar",
            assistance: "¿Necesitas ayuda? Contacta con recepción",
            errorName: "Por favor, introduce tu nombre",
            errorRoom: "Por favor, introduce tu número de habitación",
            errorNotFound: "Huésped no encontrado. Por favor, verifica tus datos.",
            errorServer: "Error del servidor. Por favor, inténtalo de nuevo más tarde."
        },
        common: {
            quantity: "Cantidad",
            price: "Precio",
            total: "Importe Total"
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/language-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/translation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LanguageProvider({ children }) {
    _s();
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("fr");
    // On sélectionne la traduction. 
    // Le "as any" ici règle le conflit de structure si une langue est plus complète qu'une autre.
    const t = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$translation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["translations"][lang];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            lang,
            setLang,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/language-context.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(LanguageProvider, "HL8eKz87p6qIHjEYfrEdjYvVtak=");
_c = LanguageProvider;
function useLanguage() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
_s1(useLanguage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_6787879d._.js.map