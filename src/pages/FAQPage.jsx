
import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import Navbar from "../components/Navbar"
import {
  ChevronDown,
  MessageCircle,
  Search,
  HelpCircle,
  Shield,
  Settings,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react"
import "./FAQPage.css"

const FAQPage = () => {
  const { darkMode } = useTheme()
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <HelpCircle size={20} />,
      color: "#22c55e",
      faqs: [
        {
          question: "What is Community Funding?",
          answer:
            "Community Funding is Ethiopia's leading crowdfunding platform that connects individuals and organizations with meaningful causes. We facilitate secure fundraising for medical emergencies, education, disaster relief, and community development initiatives across the country.",
          tags: ["platform", "crowdfunding", "community"],
        },
        {
          question: "How do I start a fundraising campaign?",
          answer:
            "Starting a campaign is simple: 1) Create your free account, 2) Click 'Start Your Campaign', 3) Tell your story with compelling photos and details, 4) Set your funding goal and timeline, 5) Share with your network. Our step-by-step guide makes it easy for anyone to launch a successful campaign.",
          tags: ["campaign", "start", "fundraising"],
        },
        {
          question: "Is there a minimum or maximum funding goal?",
          answer:
            "There's no minimum funding goal, but we recommend setting realistic targets. The maximum goal is 1,000,000 ETB for individual campaigns. For larger institutional projects, please contact our team for special arrangements.",
          tags: ["goal", "minimum", "maximum"],
        },
        {
          question: "How long can my campaign run?",
          answer:
            "Campaigns can run for up to 60 days. You can choose a shorter duration if needed. Extensions may be granted in special circumstances with approval from our team.",
          tags: ["duration", "timeline", "extension"],
        },
      ],
    },
    {
      id: "campaign-management",
      title: "Campaign Management",
      icon: <Settings size={20} />,
      color: "#16a34a",
      faqs: [
        {
          question: "How are funds distributed?",
          answer:
            "Funds are securely held in our verified escrow system until campaign completion. Once your campaign ends successfully, funds are transferred to your verified bank account within 3-5 business days. For emergency campaigns, we offer expedited processing within 24 hours.",
          tags: ["funds", "distribution", "escrow", "transfer"],
        },
        {
          question: "What happens if a campaign doesn't reach its goal?",
          answer:
            "We offer two campaign types: 'All-or-Nothing' where funds are returned if the goal isn't met, and 'Keep-What-You-Raise' where you keep all funds regardless of the goal. You choose the type when creating your campaign based on your needs.",
          tags: ["goal", "unsuccessful", "refund"],
        },
        {
          question: "Can I edit my campaign after it's published?",
          answer:
            "Yes, you can edit your campaign description, add updates, and upload new photos. However, you cannot change the funding goal or campaign type once donations have been received. Contact support for major changes.",
          tags: ["edit", "update", "modify"],
        },
        {
          question: "How do I communicate with my supporters?",
          answer:
            "Use the campaign updates feature to keep supporters informed about your progress. You can post text updates, photos, and videos. Supporters receive notifications about updates, and you can also send thank-you messages.",
          tags: ["communication", "updates", "supporters"],
        },
      ],
    },
    {
      id: "fees-security",
      title: "Fees & Security",
      icon: <Shield size={20} />,
      color: "#059669",
      faqs: [
        {
          question: "What fees are involved?",
          answer:
            "We charge a transparent 5% platform fee on successfully raised funds. Payment processing fees are 2.9% + 30 ETB per transaction for credit cards, and 1.5% for bank transfers. No hidden fees - what you see is what you pay.",
          tags: ["fees", "cost", "pricing", "transparent"],
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Absolutely. We use bank-level 256-bit SSL encryption and are PCI DSS compliant. We never store your complete payment details on our servers. All transactions are processed through certified payment gateways including Chapa and international providers.",
          tags: ["security", "payment", "encryption", "safe"],
        },
        {
          question: "How do you prevent fraud?",
          answer:
            "We have a comprehensive verification system including identity verification, document review, and AI-powered fraud detection. All campaigns are manually reviewed before going live. We also monitor for suspicious activity 24/7.",
          tags: ["fraud", "prevention", "verification", "safety"],
        },
        {
          question: "What if I'm not satisfied with a campaign I supported?",
          answer:
            "We have a donor protection policy. If you believe a campaign is fraudulent or misrepresented, contact us within 30 days. We investigate all reports and can issue refunds for verified cases of fraud or misuse.",
          tags: ["refund", "protection", "satisfaction", "dispute"],
        },
      ],
    },
    {
      id: "verification-tracking",
      title: "Verification & Tracking",
      icon: <CheckCircle size={20} />,
      color: "#15803d",
      faqs: [
        {
          question: "How do I verify a campaign's legitimacy?",
          answer:
            "Look for the green verified badge, read the detailed campaign story, check the organizer's profile and verification status, review supporting documents, and read comments from other supporters. Our verification team reviews all campaigns before approval.",
          tags: ["verification", "legitimacy", "trust", "badge"],
        },
        {
          question: "How can I track my donation?",
          answer:
            "After donating, you'll receive an email confirmation with a unique tracking ID. Log into your account to view your donation history, track campaign progress, and receive updates from campaign organizers you've supported.",
          tags: ["tracking", "donation", "history", "progress"],
        },
        {
          question: "What documents are required for campaign verification?",
          answer:
            "For personal campaigns: Valid ID, bank account details, and supporting documents (medical reports, school letters, etc.). For organizations: Registration certificate, tax ID, authorized representative ID, and project documentation.",
          tags: ["documents", "verification", "requirements", "ID"],
        },
        {
          question: "How long does verification take?",
          answer:
            "Standard verification takes 24-48 hours for complete applications. Emergency campaigns can be fast-tracked within 4-6 hours. Incomplete applications may take longer. You'll receive email updates throughout the process.",
          tags: ["verification", "time", "duration", "fast-track"],
        },
      ],
    },
  ]

  const allFaqs = faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({ ...faq, category: category.title, categoryId: category.id })),
  )

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = activeCategory === "all" || faq.categoryId === activeCategory

    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const newIndex = `${categoryIndex}-${faqIndex}`
    setExpandedIndex(expandedIndex === newIndex ? null : newIndex)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const categoryTabs = [
    { id: "all", name: "All Questions", icon: <HelpCircle size={16} /> },
    ...faqCategories.map((cat) => ({ id: cat.id, name: cat.title, icon: cat.icon })),
  ]

  return (
    <div className={`faq-page ${darkMode ? "dark" : ""}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-content">
          <div className="hero-badge">
            <HelpCircle size={16} />
            <span>Help Center</span>
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our community funding platform</p>

          {/* Search Bar */}
          <div className="faq-search">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="faq-container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              className={`category-tab ${activeCategory === tab.id ? "active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        {searchTerm || activeCategory !== "all" ? (
          // Filtered Results
          <div className="faq-results">
            <div className="results-header">
              <h2>
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
              </h2>
            </div>
            <div className="faq-list-filtered">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${expandedIndex === `filtered-${index}` ? "expanded" : ""}`}
                  onClick={() => toggleFAQ("filtered", index)}
                >
                  <div className="faq-question">
                    <div className="question-content">
                      <h3>{faq.question}</h3>
                      <span className="category-label">{faq.category}</span>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`chevron ${expandedIndex === `filtered-${index}` ? "expanded" : ""}`}
                    />
                  </div>
                  {expandedIndex === `filtered-${index}` && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                      <div className="faq-tags">
                        {faq.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="faq-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Category Grid
          <div className="faq-grid">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <div className="category-header">
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </div>
                  <h2 className="category-title">{category.title}</h2>
                  <p className="category-description">{category.faqs.length} questions</p>
                </div>
                <div className="faq-list">
                  {category.faqs.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className={`faq-item ${expandedIndex === `${categoryIndex}-${faqIndex}` ? "expanded" : ""}`}
                      onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                    >
                      <div className="faq-question">
                        <h3>{faq.question}</h3>
                        <ChevronDown
                          size={24}
                          className={`chevron ${expandedIndex === `${categoryIndex}-${faqIndex}` ? "expanded" : ""}`}
                        />
                      </div>
                      {expandedIndex === `${categoryIndex}-${faqIndex}` && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                          <div className="faq-tags">
                            {faq.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="faq-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-content">
            <div className="contact-header">
              <MessageCircle size={32} className="contact-icon" />
              <h2>Still have questions?</h2>
              <p>Can't find the answer you're looking for? Our friendly support team is here to help.</p>
            </div>
            <div className="contact-options">
              <div className="contact-option">
                <div className="contact-option-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-option-content">
                  <h3>Email Support</h3>
                  <p>Get help via email</p>
                  <span className="response-time">Response within 24 hours</span>
                </div>
                <a href="mailto:support@communityfunding.et" className="contact-button">
                  Send Email
                </a>
              </div>
              <div className="contact-option">
                <div className="contact-option-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-option-content">
                  <h3>Phone Support</h3>
                  <p>Speak with our team</p>
                  <span className="response-time">Mon-Fri, 9AM-6PM EAT</span>
                </div>
                <a href="tel:+251911234567" className="contact-button">
                  Call Now
                </a>
              </div>
              
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="faq-stats">
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Questions Resolved</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">&lt; 2hrs</div>
            <div className="stat-label">Average Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default FAQPage
