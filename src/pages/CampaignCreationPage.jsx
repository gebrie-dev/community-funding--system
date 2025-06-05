import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import ChatbotRecommendation from '../components/ChatbotRecommendation';
import {
  Upload,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  ImageIcon,
  FileTypeIcon as DocumentIcon,
  HelpCircle,
  Clock,
  User,
} from 'lucide-react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../config/api';
import './CampaignCreationPage.css';

const CampaignCreationPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    starting_date: '',
    ending_date: '',
    category: '',
    location: '',
    image: null,
    document: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    setFormData((prev) => ({
      ...prev,
      starting_date: formatDate(tomorrow),
      ending_date: formatDate(endDate),
    }));
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const categories = [
    { display: 'Medical', backend: 'MEDICAL' },
    { display: 'Education', backend: 'EDUCATION' },
    { display: 'Emergency', backend: 'EMERGENCY' },
    { display: 'Social Impact', backend: 'SOCIAL_IMPACT' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: 'Image must be less than 5MB',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error if it exists
      if (formErrors.image) {
        setFormErrors((prev) => ({
          ...prev,
          image: '',
        }));
      }
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          document: 'Document must be less than 10MB',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        document: file,
      }));

      // Clear error if it exists
      if (formErrors.document) {
        setFormErrors((prev) => ({
          ...prev,
          document: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!formData.goal) {
      errors.goal = 'Funding goal is required';
    } else if (Number.parseFloat(formData.goal) <= 0) {
      errors.goal = 'Funding goal must be greater than 0';
    }

    if (!formData.starting_date) {
      errors.starting_date = 'Start date is required';
    }

    if (!formData.ending_date) {
      errors.ending_date = 'End date is required';
    } else {
      const start = new Date(formData.starting_date);
      const end = new Date(formData.ending_date);
      if (end <= start) {
        errors.ending_date = 'End date must be after start date';
      }
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.image) {
      errors.image = 'Campaign image is required';
    }

    if (formData.category === 'Medical' && !formData.document) {
      errors.document = 'Supporting document is required for Medical campaigns';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
      setError('You must be logged in to create a campaign');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (!validateForm()) {
      setError('Please fix the errors in the form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append(
        'goal',
        Number.parseFloat(formData.goal).toFixed(2)
      );
      formDataToSend.append('starting_date', formData.starting_date);
      formDataToSend.append('ending_date', formData.ending_date);

      const categoryObj = categories.find(
        (cat) => cat.display === formData.category
      );
      formDataToSend.append(
        'category',
        categoryObj ? categoryObj.backend : formData.category.toUpperCase()
      );

      formDataToSend.append('location', formData.location);
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.document)
        formDataToSend.append('document', formData.document);

      const response = await api.post(
        API_ENDPOINTS.CAMPAIGN_CREATE,
        formDataToSend
      );

      setSuccess('Campaign created successfully!');
      navigate('/dashboard');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to create campaign:', error);

      let errorMessage = 'Failed to create campaign. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data) {
        if (error.response.data.error) errorMessage = error.response.data.error;
        else if (error.response.data.detail)
          errorMessage = error.response.data.detail;
        else if (error.response.data.validation_reason) {
          errorMessage = `Document rejected: ${error.response.data.validation_reason}`;
        } else if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(
              ([field, errors]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(', ') : errors
                }`
            )
            .join('; ');
        }
      }
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionApply = (suggestion) => {
    console.log('Applying suggestion:', suggestion);
    // Implement suggestion application logic
  };

  return (
    <div className="campaign-creation-page">
      {/* Header */}
      <header className="campaign-header">
        <div className="header-container">
          <div className="header-left">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="logo-container">
              <Logo />
              <span className="brand-name">Community Funding</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span>Welcome, {currentUser?.first_name || 'User'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="campaign-creation-container">
        {/* Page Title */}
        <div className="page-title">
          <h1>Create a Fundraising Campaign</h1>
          <p>Fill in the details below to start raising funds for your cause</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="message success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Campaign Form */}
        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="section-title">
                <h2>Campaign Information</h2>
                <div className="section-divider"></div>
              </div>

              <div className="form-group">
                <label htmlFor="title">
                  Campaign Title <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FileText size={18} className="input-icon" />
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter a clear, attention-grabbing title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={formErrors.title ? 'error' : ''}
                    disabled={loading}
                  />
                </div>
                {formErrors.title && (
                  <div className="error-text">{formErrors.title}</div>
                )}
                <div className="input-help">
                  <Info size={14} />
                  <span>
                    Keep it concise and descriptive (5-10 words recommended)
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Tag size={18} className="input-icon" />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`custom-select ${
                      formErrors.category ? 'error' : ''
                    }`}
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.backend} value={category.display}>
                        {category.display}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.category && (
                  <div className="error-text">{formErrors.category}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Campaign Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your campaign in detail. What are you raising funds for? Why is it important? How will the funds be used?"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`custom-textarea ${
                    formErrors.description ? 'error' : ''
                  } `}
                  disabled={loading}
                />
                {formErrors.description && (
                  <div className="error-text">{formErrors.description}</div>
                )}
                <div className="input-help">
                  <Info size={14} />
                  <span>
                    Be specific and authentic. A compelling story increases your
                    chances of success.
                  </span>
                </div>
              </div>

              <div className="section-title">
                <h2>Campaign Details</h2>
                <div className="section-divider"></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="starting_date">
                    Start Date <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <Input
                      id="starting_date"
                      type="date"
                      name="starting_date"
                      value={formData.starting_date}
                      onChange={handleChange}
                      className={formErrors.starting_date ? 'error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {formErrors.starting_date && (
                    <div className="error-text">{formErrors.starting_date}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="ending_date">
                    End Date <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <Input
                      id="ending_date"
                      type="date"
                      name="ending_date"
                      value={formData.ending_date}
                      onChange={handleChange}
                      className={formErrors.ending_date ? 'error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {formErrors.ending_date && (
                    <div className="error-text">{formErrors.ending_date}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goal">
                    Funding Goal <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <DollarSign size={18} className="input-icon" />
                    <Input
                      id="goal"
                      type="number"
                      placeholder="Enter amount"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      className={formErrors.goal ? 'error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {formErrors.goal && (
                    <div className="error-text">{formErrors.goal}</div>
                  )}
                  <div className="input-help">
                    <Info size={14} />
                    <span>Set a realistic goal based on your needs</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, Country"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={formErrors.location ? 'error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {formErrors.location && (
                    <div className="error-text">{formErrors.location}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="section-title">
                <h2>Campaign Media</h2>
                <div className="section-divider"></div>
              </div>

              <div className="form-group">
                <label>
                  Campaign Image <span className="required">*</span>
                </label>
                <div
                  className={`file-upload-container ${
                    formErrors.image ? 'error-border' : ''
                  }`}
                >
                  <div className="image-preview-container">
                    {previewImage ? (
                      <div className="image-preview">
                        <img
                          src={previewImage || '/placeholder.svg'}
                          alt="Campaign preview"
                        />
                        <div className="image-overlay">
                          <label
                            htmlFor="image-upload"
                            className="change-image-btn"
                          >
                            Change Image
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="image-placeholder">
                        <ImageIcon size={40} />
                        <p>Upload a compelling image</p>
                        <span>Recommended size: 1200x630px (Max: 5MB)</span>
                        <label
                          htmlFor="image-upload"
                          className="upload-image-btn"
                        >
                          <Upload size={16} />
                          Select Image
                        </label>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      disabled={loading}
                    />
                  </div>
                </div>
                {formErrors.image && (
                  <div className="error-text">{formErrors.image}</div>
                )}
                <div className="input-help">
                  <Info size={14} />
                  <span>
                    High-quality images increase engagement and donations
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  Supporting Document
                  {formData.category === 'Medical' ? (
                    <span className="required">*</span>
                  ) : (
                    <span className="optional"></span>
                  )}
                </label>
                <div
                  className={`document-upload-container ${
                    formErrors.document ? 'error-border' : ''
                  }`}
                >
                  {formData.document ? (
                    <div className="document-preview">
                      <DocumentIcon size={24} />
                      <div className="document-info">
                        <span className="document-name">
                          {formData.document.name}
                        </span>
                        <span className="document-size">
                          {(formData.document.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <label
                        htmlFor="document-upload"
                        className="change-document-btn"
                      >
                        Change
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="document-upload"
                      className="document-upload-label"
                    >
                      <Upload size={24} />
                      <div className="upload-text">
                        <span className="upload-title">
                          Upload Document (PDF)
                        </span>
                        <span className="upload-subtitle"></span>
                      </div>
                    </label>
                  )}
                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleDocumentChange}
                    className="file-input"
                    disabled={loading}
                    required={formData.category === 'Medical'}
                  />
                </div>
                {formErrors.document && (
                  <div className="error-text">{formErrors.document}</div>
                )}
              </div>

              <div className="campaign-tips">
                <div className="tips-header">
                  <HelpCircle size={20} />
                  <h3>Tips for a Successful Campaign</h3>
                </div>
                <ul>
                  <li>
                    <strong>Be specific</strong> about your funding goals and
                    how the money will be used
                  </li>
                  <li>
                    <strong>Add high-quality images</strong> that clearly show
                    your cause
                  </li>
                  <li>
                    <strong>Tell a compelling story</strong> that connects
                    emotionally with donors
                  </li>
                  <li>
                    <strong>Share your campaign</strong> on social media to
                    reach more potential donors
                  </li>
                  <li>
                    <strong>Update supporters</strong> regularly on your
                    progress
                  </li>
                </ul>
              </div>

              <div className="campaign-duration">
                <div className="duration-header">
                  <Clock size={20} />
                  <h3>Campaign Duration</h3>
                </div>
                <div className="duration-content">
                  {formData.starting_date && formData.ending_date ? (
                    <>
                      <div className="duration-info">
                        <p>
                          Your campaign will run for{' '}
                          <strong>
                            {Math.max(
                              1,
                              Math.ceil(
                                (new Date(formData.ending_date) -
                                  new Date(formData.starting_date)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )}{' '}
                            days
                          </strong>
                        </p>
                      </div>
                      <div className="duration-bar">
                        <div className="duration-progress"></div>
                      </div>
                      <div className="duration-dates">
                        <span>
                          {new Date(
                            formData.starting_date
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(formData.ending_date).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p>Select start and end dates to see campaign duration</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Campaign...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Create Campaign</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <ChatbotRecommendation
        formData={formData}
        onSuggestionApply={handleSuggestionApply}
      />
    </div>
  );
};

export default CampaignCreationPage;
