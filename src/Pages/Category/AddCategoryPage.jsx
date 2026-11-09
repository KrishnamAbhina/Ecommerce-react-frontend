import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addCategory, updateCategory } from '../../APIs/CategoriesAPI';
import { useAuth } from '../../Context/AuthContext';
import { useProducts } from '../../Context/ProductContext';
import '../../Styles/AddCategory.css';

function AddCategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { loadData } = useProducts();
  const savedFormData = location.state?.formData;
  const editingCategory = location.state?.category;
  const isEdit = location.state?.isEdit || false;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit && editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description);
    }
  }, [isEdit, editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Category name must be at least 2 characters');
      return;
    }

    if (description.trim().length < 5) {
      setError('Description must be at least 5 characters');
      return;
    }

    if (!user || !user.accessToken) {
      setError('Authentication required. Please login again.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && editingCategory) {
        await updateCategory(editingCategory.id, name.trim(), description.trim(), user.accessToken);
        setSuccess('Category updated successfully!');
      } else {
        await addCategory(name.trim(), description.trim(), user.accessToken);
        setSuccess('Category added successfully!');
      }
      setName('');
      setDescription('');

      // Refresh categories in ProductContext
      await loadData();

      setTimeout(() => {
        if (savedFormData) {
          navigate('/add-product', { state: { formData: savedFormData } });
        } else {
          navigate(-1);
        }
      }, 1500);
    } catch (err) {
      setError(err.message || (isEdit ? 'Failed to update category' : 'Failed to add category'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page">
      {/* Navbar */}
      <nav className="add-category-navbar">
        <span className="add-category-navbar-brand">ShopApp</span>
        <button className="add-category-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </nav>

      {/* Main Content */}
      <main className="add-category-main">
        <div className="add-category-container">
          <div className="add-category-card">
            <div className="add-category-header">
              <h1 className="add-category-title">{isEdit ? 'Edit Category' : 'Add New Category'}</h1>
              <p className="add-category-subtitle">{isEdit ? 'Update category information' : 'Create a new product category'}</p>
            </div>

            <form onSubmit={handleSubmit} className="add-category-form">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter category description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (isEdit ? 'Updating Category...' : 'Adding Category...') : (isEdit ? 'Update Category' : 'Add Category')}
                </button>
                <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
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

export default AddCategoryPage;
