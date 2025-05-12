"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import Input from "../components/Input"
import Button from "../components/Button"
import ChatbotRecommendation from "../components/ChatbotRecommendation"
import { Upload, MapPin, Calendar, DollarSign, FileText, Tag, ArrowLeft } from "lucide-react"
import "./CampaignCreationPage.css"

const CampaignCreationPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    startDate: "",
    endDate: "",
    category: "",
    location: "",
    image: null,
    document: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const categories = [
    "Medical",
    "Education",
    "Emergency",
    "Social Impact",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        document: file,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call to create campaign
      await new Promise((resolve) => setTimeout(resolve, 1500))
      navigate("/success")
    } catch (error) {
      console.error("Failed to create campaign:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionApply = (suggestion) => {
    // This function would handle applying suggestions from the chatbot
    // For example, it could update form fields or show additional guidance
    console.log("Applying suggestion:", suggestion)
  }

  return (
    <div className="campaign-creation-page">
      <div className="campaign-creation-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <Logo />
          <h1>Community Funding</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, User</span>
        </div>
      </div>

      <div className="campaign-creation-container">
        <div className="form-header">
          <h2>Create a New Campaign</h2>
          <p>Fill in the details below to create your fundraising campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="title">
                  <span>Title</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FileText size={18} className="input-icon" />
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter campaign title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  <span>Category</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Tag size={18} className="input-icon" />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="custom-select"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <span>Description</span>
                  <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your campaign in detail"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="custom-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">
                    <span>Start Date</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <Input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    <span>End Date</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <Input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goal">
                    <span>Funding Goal</span>
                    <span className="required">*</span>
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
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    <span>Location</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>
                  <span>Campaign Image</span>
                  <span className="required">*</span>
                </label>
                <div className="file-upload-container">
                  <label htmlFor="image-upload" className="file-upload-label">
                    <Upload size={24} />
                    <span>Upload Image</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      required
                    />
                  </label>

                  <div className="image-preview-container">
                    {previewImage ? (
                      <div className="image-preview">
                        <img src={previewImage || "/placeholder.svg"} alt="Campaign preview" />
                      </div>
                    ) : (
                      <div className="image-placeholder">
                        <FileText size={48} />
                        <p>No image selected</p>
                        <span>Recommended size: 1200x630px</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <span>Supporting Document</span>
                  <span className="optional">(optional)</span>
                </label>
                <div className="file-upload-container">
                  <label htmlFor="document-upload" className="file-upload-label">
                    <Upload size={24} />
                    <span>Upload Document</span>
                    <input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentChange}
                      className="file-input"
                    />
                  </label>
                  {formData.document && (
                    <div className="document-info">
                      <FileText size={20} />
                      <span>{formData.document.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="campaign-tips">
                <h3>Tips for a Successful Campaign</h3>
                <ul>
                  <li>Be clear and specific about your funding goals</li>
                  <li>Add high-quality images to attract more donors</li>
                  <li>Share your campaign on social media</li>
                  <li>Keep your supporters updated on progress</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </div>

      {/* Add the chatbot recommendation component */}
      <ChatbotRecommendation formData={formData} onSuggestionApply={handleSuggestionApply} />
    </div>
  )
}

export default CampaignCreationPage
