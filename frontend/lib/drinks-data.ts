export type DrinkCategory = "cocktails" | "soft-drinks" | "wines" | "beers";

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: DrinkCategory;
}

export const drinks: Drink[] = [
  // Cocktails
  {
    id: "mojito",
    name: "Classic Mojito",
    description: "White rum, fresh mint, lime, sugar cane, sparkling water",
    price: 14,
    image: "/images/drinks/mojito.jpg",
    category: "cocktails",
  },
  {
    id: "sangria",
    name: "Spanish Sangria",
    description: "Red wine, fresh fruits, brandy, orange liqueur",
    price: 12,
    image: "/images/drinks/sangria.jpg",
    category: "cocktails",
  },
  {
    id: "margarita",
    name: "Premium Margarita",
    description: "Tequila reposado, Cointreau, fresh lime, agave",
    price: 16,
    image: "/images/drinks/margarita.jpg",
    category: "cocktails",
  },
  {
    id: "espresso-martini",
    name: "Espresso Martini",
    description: "Vodka, coffee liqueur, fresh espresso, vanilla",
    price: 15,
    image: "/images/drinks/espresso-martini.jpg",
    category: "cocktails",
  },
  // Soft Drinks
  {
    id: "coca-cola",
    name: "Coca-Cola",
    description: "Classic Coca-Cola served ice cold",
    price: 5,
    image: "/images/drinks/coca-cola.jpg",
    category: "soft-drinks",
  },
  {
    id: "sprite",
    name: "Sprite",
    description: "Crisp lemon-lime refreshment with ice",
    price: 5,
    image: "/images/drinks/sprite.jpg",
    category: "soft-drinks",
  },
  {
    id: "fanta",
    name: "Fanta Orange",
    description: "Sparkling orange soda, perfectly chilled",
    price: 5,
    image: "/images/drinks/fanta.jpg",
    category: "soft-drinks",
  },
  {
    id: "sparkling-water",
    name: "Premium Sparkling",
    description: "San Pellegrino with fresh lemon",
    price: 6,
    image: "/images/drinks/sparkling-water.jpg",
    category: "soft-drinks",
  },
  {
    id: "tonic-water",
    name: "Premium Tonic",
    description: "Fever-Tree tonic with lime",
    price: 6,
    image: "/images/drinks/tonic-water.jpg",
    category: "soft-drinks",
  },
  {
    id: "fresh-juice",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed Seville oranges",
    price: 8,
    image: "/images/drinks/fresh-juice.jpg",
    category: "soft-drinks",
  },
  {
    id: "lemonade",
    name: "Homemade Lemonade",
    description: "Fresh lemons, mint, and a touch of honey",
    price: 7,
    image: "/images/drinks/lemonade.jpg",
    category: "soft-drinks",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description: "Premium black tea with lemon, served cold",
    price: 6,
    image: "/images/drinks/iced-tea.jpg",
    category: "soft-drinks",
  },
  {
    id: "ginger-ale",
    name: "Ginger Ale",
    description: "Refreshing ginger soda with lime",
    price: 5,
    image: "/images/drinks/ginger-ale.jpg",
    category: "soft-drinks",
  },
  {
    id: "energy-drink",
    name: "Red Bull",
    description: "Premium energy drink, served chilled",
    price: 7,
    image: "/images/drinks/energy-drink.jpg",
    category: "soft-drinks",
  },
  // Wines
  {
    id: "rioja-wine",
    name: "Rioja Reserva",
    description: "Marqués de Cáceres, 2018 vintage",
    price: 18,
    image: "/images/drinks/rioja-wine.jpg",
    category: "wines",
  },
  {
    id: "albarino",
    name: "Albariño",
    description: "Rías Baixas, crisp and refreshing",
    price: 16,
    image: "/images/drinks/sparkling-water.jpg",
    category: "wines",
  },
  // Beers
  {
    id: "craft-beer",
    name: "Andalusian Craft",
    description: "Local artisan pale ale",
    price: 8,
    image: "/images/drinks/craft-beer.jpg",
    category: "beers",
  },
  {
    id: "estrella",
    name: "Estrella Galicia",
    description: "Premium Spanish lager",
    price: 6,
    image: "/images/drinks/craft-beer.jpg",
    category: "beers",
  },
];

export const categories: { id: DrinkCategory; label: string }[] = [
  { id: "cocktails", label: "Cocktails" },
  { id: "soft-drinks", label: "Soft Drinks" },
  { id: "wines", label: "Wines" },
  { id: "beers", label: "Beers" },
];
