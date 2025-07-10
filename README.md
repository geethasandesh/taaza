# Taaza Meat - Meat Shop Application

A professional, mobile-first meat shop application built with React and Tailwind CSS. This app allows customers to browse products, add items to cart, and place orders for in-store pickup.

## Features

### 🏠 Home Page
- **Hero Banner**: Sliding promotional images with auto-rotation
- **Category Navigation**: Browse by Chicken, Mutton, Seafood, Eggs, and Masalas
- **Bestsellers Section**: Featured products with discounts
- **Product Grid**: Responsive product cards with add-to-cart functionality
- **Mobile Bottom Navigation**: Easy category switching and cart access

### 🛒 Cart Page
- **Cart Items**: List of added products with images and details
- **Quantity Controls**: Increase/decrease quantity or remove items
- **Order Summary**: Subtotal, delivery fee, and total calculation
- **Checkout Button**: Proceed to checkout process

### 💳 Checkout Page
- **Customer Form**: Name, phone number, and order notes
- **Order Summary**: Review items and total
- **Store Information**: Address, contact, and pickup instructions
- **Payment Information**: Pay at store option

### ✅ Order Success Page
- **Confirmation**: Order placed successfully message
- **Order Details**: Order number and pickup time
- **Store Information**: Collection instructions
- **Continue Shopping**: Return to home page

## Tech Stack

- **React 19**: Modern React with hooks
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Context API**: State management for cart functionality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.jsx
│   ├── SectionHeading.jsx
│   ├── BottomNavBar.jsx
│   └── HeroBanner.jsx
├── pages/              # Application pages
│   ├── Home.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── OrderSuccess.jsx
├── context/            # React context for state management
│   └── CartContext.jsx
├── data/               # Mock data and constants
│   └── products.js
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Design System

### Color Palette
- **Primary**: Dark Red (#B03B3B) - Used for buttons, text, and accents
- **Background**: Light Gray (#F9FAFB) - Page backgrounds
- **Cards**: White (#FFFFFF) - Product cards and containers
- **Borders**: Gray (#E5E7EB) - Subtle borders and dividers

### Typography
- **Font Family**: Inter (system fallback)
- **Hierarchy**: Clear font sizes and weights for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean input fields with focus states
- **Navigation**: Intuitive mobile-first design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Desktop Support**: Enhanced layout for larger screens
- **Touch-Friendly**: Large touch targets and intuitive gestures

### Cart Management
- **Add to Cart**: One-click product addition
- **Quantity Control**: Increment/decrement with visual feedback
- **Remove Items**: Easy item removal
- **Persistent State**: Cart maintained during navigation

### User Experience
- **Smooth Navigation**: Seamless page transitions
- **Loading States**: Visual feedback for user actions
- **Error Handling**: Graceful error states
- **Accessibility**: Keyboard navigation and screen reader support

## Customization

### Adding New Products
Edit `src/data/products.js` to add new products:
```javascript
{
  id: 16,
  name: "New Product",
  category: "chicken",
  price: 200,
  weight: "500g",
  image: "product-image-url"
}
```

### Styling Changes
- Modify `src/index.css` for global styles
- Update component classes for specific styling
- Use Tailwind utility classes for quick changes

### Adding New Categories
Update the categories array in `src/data/products.js` and the bottom navigation component.

## Future Enhancements

- **Backend Integration**: Connect to real API endpoints
- **User Authentication**: Customer accounts and order history
- **Payment Gateway**: Online payment processing
- **Push Notifications**: Order status updates
- **Offline Support**: PWA capabilities
- **Multi-language**: Internationalization support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
