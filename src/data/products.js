const sharedImage = "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop";

export const products = [
  // Chicken Products
  {
    id: 1,
    name: "Fresh Chicken Breast",
    category: "chicken",
    subcategory: "boneless-mince",
    price: 180,
    originalPrice: 220,
    discount: 18,
    weight: "500g",
    image: sharedImage
  },
  {
    id: 2,
    name: "Chicken Thighs",
    category: "chicken",
    subcategory: "curry-cuts",
    price: 160,
    weight: "500g",
    image: sharedImage
  },
  {
    id: 3,
    name: "Chicken Wings",
    category: "chicken",
    subcategory: "speciality-cuts",
    price: 140,
    originalPrice: 180,
    discount: 22,
    weight: "500g",
    image: sharedImage
  },
  {
    id: 4,
    name: "Chicken Mince",
    category: "chicken",
    subcategory: "boneless-mince",
    price: 150,
    weight: "500g",
    image: sharedImage
  },
  // Mutton Products
  {
    id: 5,
    name: "Mutton Curry Cut",
    category: "mutton",
    subcategory: "curry-cuts",
    price: 650,
    originalPrice: 750,
    discount: 13,
    weight: "500g",
    image: sharedImage
  },
  {
    id: 6,
    name: "Mutton Biryani Cut",
    category: "mutton",
    subcategory: "biryani-cut",
    price: 680,
    weight: "500g",
    image: sharedImage
  },
  {
    id: 7,
    name: "Mutton Mince",
    category: "mutton",
    subcategory: "mince",
    price: 720,
    weight: "500g",
    image: sharedImage
  },
  // Eggs Products
  {
    id: 11,
    name: "Farm Fresh Eggs",
    category: "eggs",
    subcategory: "farm-fresh",
    price: 120,
    originalPrice: 150,
    discount: 20,
    weight: "12 pieces",
    image: sharedImage
  },
  {
    id: 12,
    name: "Organic Eggs",
    category: "eggs",
    subcategory: "organic",
    price: 180,
    weight: "12 pieces",
    image: sharedImage
  },
  // Masalas Products
  {
    id: 13,
    name: "Chicken Masala",
    category: "masalas",
    subcategory: "chicken-masala",
    price: 45,
    weight: "100g",
    image: sharedImage
  },
  {
    id: 14,
    name: "Mutton Masala",
    category: "masalas",
    subcategory: "mutton-masala",
    price: 55,
    weight: "100g",
    image: sharedImage
  }
];

export const categories = [
  { id: 'all', name: 'All Products', icon: '🏠' },
  { id: 'chicken', name: 'Chicken', icon: '🍗' },
  { id: 'mutton', name: 'Mutton', icon: '🐑' },
  { id: 'eggs', name: 'Eggs', icon: '🥚' },
  { id: 'masalas', name: 'Masalas', icon: '🌶️' }
];

const sharedCategoryImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80';

export const shopCategories = [
  { name: 'Chicken', image: sharedCategoryImage },
  { name: 'Mutton', image: sharedCategoryImage },
  { name: 'Eggs', image: sharedCategoryImage },
  { name: 'Masala', image: sharedCategoryImage },
];

export const categoriesConfig = [
  {
    key: 'chicken',
    name: 'Chicken',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'all', name: 'All', image: sharedCategoryImage },
      { key: 'curry-cuts', name: 'Curry Cuts', image: sharedCategoryImage },
      { key: 'boneless-mince', name: 'Boneless & Mince', image: sharedCategoryImage },
      { key: 'speciality-cuts', name: 'Speciality Cuts', image: sharedCategoryImage },
      { key: 'offals', name: 'Offals', image: sharedCategoryImage },
      { key: 'combos', name: 'Combos', image: sharedCategoryImage },
      { key: 'premium-cuts', name: 'Premium Cuts', image: sharedCategoryImage },
    ]
  },
  {
    key: 'mutton',
    name: 'Mutton',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'all', name: 'All', image: sharedCategoryImage },
      { key: 'curry-cuts', name: 'Curry Cuts', image: sharedCategoryImage },
      { key: 'mince', name: 'Mince', image: sharedCategoryImage },
      { key: 'chops', name: 'Chops', image: sharedCategoryImage },
      { key: 'biryani-cut', name: 'Biryani Cut', image: sharedCategoryImage },
    ]
  },
  {
    key: 'eggs',
    name: 'Eggs',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'all', name: 'All', image: sharedCategoryImage },
      { key: 'farm-fresh', name: 'Farm Fresh', image: sharedCategoryImage },
      { key: 'organic', name: 'Organic', image: sharedCategoryImage },
    ]
  },
  {
    key: 'masalas',
    name: 'Masalas',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'all', name: 'All', image: sharedCategoryImage },
      { key: 'chicken-masala', name: 'Chicken Masala', image: sharedCategoryImage },
      { key: 'mutton-masala', name: 'Mutton Masala', image: sharedCategoryImage }
    ]
  }
];

export const categoriesWithSub = [
  {
    name: 'Chicken',
    subtitle: 'Raised on biosecure farms',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'curry-cuts', name: 'Curry Cuts', image: sharedCategoryImage },
      { key: 'boneless-mince', name: 'Boneless & Mince', image: sharedCategoryImage },
      { key: 'speciality-cuts', name: 'Speciality Cuts', image: sharedCategoryImage },
      { key: 'offals', name: 'Offals', image: sharedCategoryImage },
      { key: 'combos', name: 'Combos', image: sharedCategoryImage },
      { key: 'premium-cuts', name: 'Premium Cuts', image: sharedCategoryImage },
    ]
  },
  {
    name: 'Mutton',
    subtitle: 'Pasture raised lamb & goats',
    image: sharedCategoryImage,
    subcategories: [
      { key: 'curry-cuts', name: 'Curry Cuts', image: sharedCategoryImage },
      { key: 'mince', name: 'Mince', image: sharedCategoryImage },
      { key: 'chops', name: 'Chops', image: sharedCategoryImage },
      { key: 'biryani-cut', name: 'Biryani Cut', image: sharedCategoryImage },
    ]
  },
  
  {
    name: 'Ready to cook',
    subtitle: 'Freshly marinated meats',
    image: sharedCategoryImage,
    subcategories: []
  },
  {
    name: 'Taaza Special',
    subtitle: 'Taaza Specials',
    image: sharedCategoryImage,
    subcategories: []
  },
  
]; 