import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../../Components/Products/ProductGrid';
import '../../Styles/ProductPage.css';
import { useProducts } from '../../Context/ProductContext';
import { useCart } from '../../Context/CartContext';
import { deleteCategory } from '../../APIs/CategoriesAPI';

// ── Component ─────────────────────────────────────────────────────────────────
function ProductPage({ user, onLogout }) {
  const navigate = useNavigate();
  const { products, categories, loading, error, loadData } = useProducts();
  const { getTotalItems, fetchCartItems } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const ALL_CATEGORIES = useMemo(() => {
    if (!categories.length) return ['All'];
    return ['All', ...categories.map((cat) => cat.name)];
  }, [categories]);

  const handleEditCategory = (category) => {
    navigate('/add-category', { state: { category, isEdit: true } });
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}" category? All products in this category will be deleted.`)) {
      return;
    }

    setDeletingCategoryId(categoryId);
    try {
      await deleteCategory(categoryId, user.accessToken);

      // Reset filter if deleted category was active
      if (activeCategory === categoryName) {
        setActiveCategory('All');
      }

      // Refresh all data
      await loadData();
      await fetchCartItems();

      alert('Category and all related products deleted successfully!');
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Please try again.');
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // Filter and Sort
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      let matchesCategory = true;
      if (activeCategory !== 'All') {
        const productCategory = categories.find((cat) => cat.id === p.categoryId);
        matchesCategory = productCategory && productCategory.name === activeCategory;
      }
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'stock') result = [...result].sort((a, b) => b.stock - a.stock);

    return result;
  }, [products, categories, search, activeCategory, sort]);

  if (loading) {
    return (
      <div className="product-page">
        <nav className="product-navbar">
          <span className="product-navbar-brand">🛒 ShopApp</span>
        </nav>
        <main className="product-main">
          <p className="product-results-count">Loading products...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <nav className="product-navbar">
          <span className="product-navbar-brand">🛒 ShopApp</span>
        </nav>
        <main className="product-main">
          <p className="product-results-count">Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* Navbar */}
      <nav className="product-navbar">
        <span className="product-navbar-brand">🛒 ShopApp</span>
        <div className="product-navbar-right">
          <span className="product-navbar-text">
            {products.length} Products
          </span>
          <Link to="/cart" className="product-cart-btn">
            Cart ({getTotalItems()})
          </Link>
          {user && user.role === 'admin' && (
            <>
              <Link to="/users" className="product-see-users-btn">
                All Users
              </Link>
              <Link to="/add-product" className="product-add-category-btn">
                + Add Product
              </Link>
            </>
          )}
          {user && (
            <div className="product-navbar-user">
              <span className="product-navbar-username">{user.email}</span>
              <button className="product-logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="product-main">
        {/* Page Header */}
        <div className="product-header">
          <h1 className="product-title">All Products</h1>
          <p className="product-subtitle">Browse our full catalogue</p>
        </div>

        {/* Search + Sort Toolbar */}
        <div className="product-toolbar">
          <div className="product-search-wrapper">
            
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="product-search-input"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="product-sort-select"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="stock">In Stock First</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="product-category-bar">
          {ALL_CATEGORIES.map((cat) => {
            const category = categories.find((c) => c.name === cat);
            return (
              <div key={cat} className="category-item">
                <button
                  className={`product-category-btn ${activeCategory === cat ? 'active' : 'inactive'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
                {user && user.role === 'admin' && cat !== 'All' && category && (
                  <>
                    <button
                      className="category-edit-btn"
                      onClick={() => handleEditCategory(category)}
                      title="Edit category"
                    >
                      U
                    </button>
                    <button
                      className="category-delete-btn"
                      onClick={() => handleDeleteCategory(category.id, cat)}
                      disabled={deletingCategoryId === category.id}
                      title="Delete category"
                    >
                      {deletingCategoryId === category.id ? '...' : '✕'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Count */}
        <p className="product-results-count">
          Showing {filtered.length} of {products.length} products
        </p>

        {/* Product Grid */}
        <ProductGrid products={filtered} />
      </main>
    </div>
  );
}

export default ProductPage;
