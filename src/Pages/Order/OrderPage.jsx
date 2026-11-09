import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { useProducts } from '../../Context/ProductContext';
import { placeOrder, getOrdersByUser } from '../../APIs/OrdersAPI';
import '../../Styles/OrderPage.css';

const PAYMENT_MODES = [
  { value: 1, label: 'Cash' },
  { value: 2, label: 'Card' },
  { value: 3, label: 'UPI' },
];

const paymentModeLabel = (value) =>
  PAYMENT_MODES.find(
    (m) => m.value === Number(value) || m.label.toLowerCase() === String(value).toLowerCase()
  )?.label ?? String(value);

function OrderPage() {
  const { cartItems, getTotalPrice, getTotalItems, fetchCartItems } = useCart();
  const { user } = useAuth();
  const { products, loadData: refreshProducts } = useProducts();
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!user?.id || !user?.accessToken) return;
    setOrdersLoading(true);
    try {
      const data = await getOrdersByUser(user.id, user.accessToken);
      const list = Array.isArray(data) ? data : data ? [data] : [];
      setOrders([...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setOrdersError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError(err.message);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please enter an address');
      return;
    }

    try {
      setIsProcessing(true);
      await placeOrder({
        userId: String(user.id),
        address: address.trim(),
        description: description.trim(),
        paymentMode,
      }, user.accessToken);

      alert('Order placed successfully!');
      setAddress('');
      setDescription('');
      await fetchCartItems();
      await loadOrders();
      await refreshProducts();
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const productName = (productId) =>
    products.find((p) => p.id === productId)?.name ?? `Product #${productId}`;

  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
  };

  const subtotal = getTotalPrice();
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="order-page">
      <nav className="order-navbar">
        <Link to="/productshome" className="order-navbar-brand">🛒 ShopApp</Link>
      </nav>

      <main className="order-main">
        <div className="order-header">
          <h1 className="order-title">Checkout</h1>
          <p className="order-subtitle">Complete your order</p>
        </div>

        <div className="order-container">
          <div className="order-section">
            <h2 className="order-section-title">Order Details</h2>

            <form className="order-form" onSubmit={(e) => e.preventDefault()}>
              <div className="order-form-row">
                <input
                  type="text"
                  className="order-input"
                  value={user?.id ?? ''}
                  readOnly
                  disabled
                  aria-label="User ID"
                />
              </div>
              <div className="order-form-row">
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="order-input"
                />
              </div>
              <div className="order-form-row">
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="order-input"
                />
              </div>
              <div className="order-form-row">
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(Number(e.target.value))}
                  className="order-input"
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          <div className="order-summary-section">
            <div className="order-section">
              <h2 className="order-section-title">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="order-empty">Your cart is empty. Please add items before checkout.</p>
              ) : (
                <div className="order-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item-details">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-quantity">Qty: {item.quantity}</span>
                      </div>
                      <span className="order-item-price">RS {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="order-summary">
              <h3 className="order-summary-title">Price Breakdown</h3>

              <div className="order-summary-row">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>RS {subtotal.toFixed(2)}</span>
              </div>

              <div className="order-summary-row">
                <span>Shipping</span>
                <span>RS {shipping.toFixed(2)}</span>
              </div>

              <div className="order-summary-row">
                <span>Tax</span>
                <span>RS {tax.toFixed(2)}</span>
              </div>

              <div className="order-divider"></div>

              <div className="order-summary-row order-summary-total">
                <span>Total Amount</span>
                <span>RS {total.toFixed(2)}</span>
              </div>

              <div className="order-button-group">
                <button
                  className="order-place-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
                <Link to="/cart" className="order-cancel-btn">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section className="order-history">
          <h2 className="order-section-title">My Orders</h2>

          {ordersLoading && <p className="order-history-status">Loading orders...</p>}
          {!ordersLoading && ordersError && <p className="order-history-error">Error: {ordersError}</p>}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <p className="order-history-status">No orders yet.</p>
          )}

          <div className="order-history-list">
            {orders.map((order) => (
              <div key={order.id} className="order-history-card">
                <div className="order-history-header">
                  <span className="order-history-id">Order #{order.id}</span>
                  <span className="order-history-date">{formatDate(order.createdAt)}</span>
                </div>

                <p className="order-history-line">{order.address}</p>
                {order.description && <p className="order-history-line">{order.description}</p>}
                <p className="order-history-line">Payment mode: {paymentModeLabel(order.paymentMode)}</p>

                <div className="order-history-items">
                  {(order.items || []).map((item) => (
                    <div key={`${item.id}-${item.productId}`} className="order-history-item">
                      <span>{productName(item.productId)} × {item.quantity}</span>
                      <span>RS {Number(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-history-footer">
                  <span>{order.numberOfItems} items</span>
                  <span>Total RS {Number(order.totalPrice).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderPage;
