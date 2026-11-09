import React from 'react';
import { useCart } from '../../Context/CartContext';
import '../../Styles/CartItem.css';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <span className="cart-item-image-placeholder">🛍️</span>
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-description">{item.category}</p>
        <span className="cart-item-price">RS {item.price.toFixed(2)}</span>
      </div>

      <div className="cart-item-actions">
        <div className="cart-item-quantity">
          <button className="quantity-btn" onClick={handleDecrement}>
            −
          </button>
          <input
            type="number"
            className="quantity-input"
            value={item.quantity}
            readOnly
          />
          <button className="quantity-btn" onClick={handleIncrement}>
            +
          </button>
        </div>
        <span className="cart-item-total">RS {(item.price * item.quantity).toFixed(2)}</span>
        <button className="cart-item-remove" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
