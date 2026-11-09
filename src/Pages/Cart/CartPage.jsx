import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import CartItem from '../../Components/Cart/CartItem';
import '../../Styles/CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice, getTotalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <nav className="cart-navbar">
          <span className="cart-navbar-brand">Cart</span>
        </nav>
        <main className="cart-main">
          <div className="cart-empty">
            <p className="cart-empty-text">Your cart is empty</p>
            <Link to="/productshome" className="cart-back-link">
              ← Back to Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Navbar */}
      <nav className="cart-navbar">
        <span className="cart-navbar-brand"> Cart</span>
        <div className="cart-navbar-right">
          <span className="cart-navbar-text">{getTotalItems()} Items</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="cart-main">
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items-section">
            <h2 className="cart-section-title">Order Summary</h2>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h3 className="cart-summary-title">Summary</h3>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>RS {getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="cart-summary-row">
                <span>Tax</span>
                <span>RS 0.00</span>
              </div>

              <div className="cart-divider"></div>

              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>RS {getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="cart-button-group">
                <button className="cart-checkout-btn" onClick={() => navigate('/order')}>Proceed to Checkout</button>
                <Link to="/productshome" className="cart-continue-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <button className="cart-clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CartPage;
