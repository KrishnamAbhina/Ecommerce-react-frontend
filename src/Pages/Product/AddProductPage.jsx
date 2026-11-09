
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { addProduct, updateProduct } from '../../APIs/productAPI';
import { useAuth } from '../../Context/AuthContext';
import { useProducts } from '../../Context/ProductContext';
import '../../Styles/AddProduct.css';

function AddProductPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user } = useAuth();
  const { categories, products, loadData } = useProducts();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // Load existing product when editing
  const loadProductData = useCallback(() => {
    try {
      const product = products.find(
        p => p.id === parseInt(productId, 10)
      );

      if (product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategoryId(product.categoryId);
        setQuantity(product.quantity?.toString() || '');
        setImageUrl(product.imageUrl || '');
        setInitialLoading(false);
      } else {
        setError('Product not found');
        setInitialLoading(false);
      }
    } catch (err) {
      setError('Failed to load product data');
      console.error(err);
      setInitialLoading(false);
    }
  }, [products, productId]);

  // Run when product data or edit details change
  useEffect(() => {
    if (isEdit && productId) {
      loadProductData();
    } else {
      setInitialLoading(false);
    }
  }, [isEdit, productId, loadProductData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (!categoryId) {
      setError('Category is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Product name must be at least 2 characters');
      return;
    }

    if (description.trim().length < 5) {
      setError('Description must be at least 5 characters');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    if (!user || !user.accessToken) {
      setError('Authentication required. Please login again.');
      return;
    }

    setLoading(true);

    try {
      if (isEdit && productId) {
        await updateProduct(
          productId,
          name.trim(),
          description.trim(),
          parseFloat(price),
          categoryId,
          parseFloat(quantity),
          imageUrl.trim(),
          user.accessToken
        );

        setSuccess('Product updated successfully!');
      } else {
        await addProduct(
          name.trim(),
          description.trim(),
          parseFloat(price),
          categoryId,
          parseFloat(quantity),
          imageUrl.trim(),
          user.accessToken
        );

        setSuccess('Product added successfully!');
      }

      await loadData();

      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setQuantity('');
      setImageUrl('');

      setTimeout(() => navigate('/productshome'), 500);
    } catch (err) {
      setError(
        err.message ||
        (isEdit ? 'Failed to update product' : 'Failed to add product')
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="add-product-page">
        <nav className="add-product-navbar">
          <span className="add-product-navbar-brand">🛒 ShopApp</span>
        </nav>

        <main className="add-product-main">
          <div className="add-product-container">
            <div className="add-product-card">
              <p>Loading product data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      {/* Navbar */}
      <nav className="add-product-navbar">
        <span className="add-product-navbar-brand">🛒 ShopApp</span>

        <button
          className="add-product-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </nav>

      {/* Main Content */}
      <main className="add-product-main">
        <div className="add-product-container">
          <div className="add-product-card">
            <div className="add-product-header">
              <h1 className="add-product-title">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>

              <p className="add-product-subtitle">
                {isEdit
                  ? 'Update product information'
                  : 'Create a new product listing'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="add-product-form">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (RS)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <label className="form-label">Category</label>

                  <Link
                    to="/add-category"
                    style={{
                      width: '28px',
                      height: '28px',
                      padding: '0',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                    title="Add Category"
                  >
                    +
                  </Link>
                </div>

                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? (isEdit ? 'Updating Product...' : 'Adding Product...')
                    : (isEdit ? 'Update Product' : 'Add Product')}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProductPage;
