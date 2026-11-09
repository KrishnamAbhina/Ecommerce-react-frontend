import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import { useProducts } from '../../Context/ProductContext';
import { deleteProduct } from '../../APIs/productAPI';
import '../../Styles/ProductCard.css';

function ProductCard({ product }) {
  const { addToCart, fetchCartItems } = useCart();
  const { user } = useAuth();
  const { removeProduct, loadData } = useProducts();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const { name, description, price, categoryName, stock, imageUrl } = product;
  const inStock = stock > 0;

  // Handle image URL - can be data URL, relative path, or full URL
  const getImageSrc = () => {
    if (!imageUrl) {
      console.log('No imageUrl for product:', name);
      return null;
    }

    // If it's a data URL or full URL, use as-is
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
      console.log('Using direct image URL:', imageUrl);
      return imageUrl;
    }

    // If it's a relative path, construct full URL
    return imageUrl;
  };

  const imageSrc = getImageSrc();

  function handleAddToCart() {
    if (!inStock || quantity <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleIncrement() {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  }

  function handleDecrement() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteProduct(product.id, user.accessToken);
      removeProduct(product.id);

      // Refresh cart data after deletion
      await fetchCartItems();

      // Refresh all product data
      await loadData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  const buttonClass = added ? 'product-add-button added' : inStock ? 'product-add-button in-stock' : 'product-add-button out-of-stock';

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {imageSrc ? (
          <img src={imageSrc} alt={name} className="product-image" onError={() => console.log('Image failed to load:', imageSrc)} />
        ) : (
          <span className="product-image-placeholder">🛍️</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category">{categoryName}</span>
        <p className="product-name">{name}</p>
        <p className="product-description">{description}</p>

        <div className="product-footer">
          <span className="product-price">RS {price.toFixed(2)}</span>
          <span className={`product-stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="product-action">
          <div className="product-quantity">
            <button
              className="quantity-btn"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              −
            </button>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              readOnly
            />
            <button
              className="quantity-btn"
              onClick={handleIncrement}
              disabled={quantity >= stock || !inStock}
            >
              +
            </button>
          </div>
          <button className={buttonClass} onClick={handleAddToCart} disabled={!inStock}>
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
          {user && user.role === 'admin' && (
            <div className="product-admin-actions">
              <Link to={`/edit-product/${product.id}`} className="product-update-button">
                Update
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="product-delete-button"
                title="Delete this product"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
