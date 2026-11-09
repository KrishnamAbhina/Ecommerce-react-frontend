import { Navigate } from 'react-router-dom';
import LoginPage from './Pages/Auth/LoginPage';
import ProductPage from './Pages/Product/ProductPage';
import CartPage from './Pages/Cart/CartPage';
import OrderPage from './Pages/Order/OrderPage';
import AddCategoryPage from './Pages/Category/AddCategoryPage';
import AddProductPage from './Pages/Product/AddProductPage';
import UsersPage from './Pages/Users/UsersPage';
import { ProductProvider } from './Context/ProductContext';
import { CartProvider } from './Context/CartContext';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { Routes, Route } from 'react-router-dom';

function AppContent() {
  const { user, logout, isTokenValid } = useAuth();

  if (!user || !user.accessToken || !isTokenValid(user.accessToken)) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={() => {}} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ProductProvider>
      <CartProvider>
        <Routes>
          <Route path="/productshome" element={<ProductPage user={user} onLogout={() => logout()} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/add-category" element={<AddCategoryPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:productId" element={<AddProductPage isEdit={true} />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/" element={<Navigate to="/productshome" replace />} />
          <Route path="*" element={<Navigate to="/productshome" replace />} />
        </Routes>
      </CartProvider>
    </ProductProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
