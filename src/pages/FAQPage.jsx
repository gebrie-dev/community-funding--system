import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { ChevronDown, MessageCircle } from "lucide-react";
import "./FAQPage.css";

const FAQPage = () => {
  const { darkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "What is Community Funding?",
          answer:
            "Community Funding is a platform that connects individuals and organizations with community projects that need financial support. We facilitate crowdfunding for various causes, from disaster relief to community development initiatives.",
        },
        {
          question: "How do I start a fundraising campaign?",
          answer:
            "To start a campaign, create an account, click on 'Start Campaign', and follow the step-by-step process. You'll need to provide details about your cause, set a funding goal, and create compelling content to engage potential donors.",
        },
      ],
    },
    {
      title: "Campaign Management",
      faqs: [
        {
          question: "How are funds distributed?",
          answer:
            "Funds are securely held in escrow until the campaign ends. Once the campaign is complete, funds are transferred to the campaign organizer's verified account. For disaster relief campaigns, funds may be distributed in phases based on immediate needs.",
        },
        {
          question: "What happens if a campaign doesn't reach its goal?",
          answer:
            "Campaigns can be set up as 'All-or-Nothing' or 'Keep-What-You-Raise'. In All-or-Nothing campaigns, funds are returned to donors if the goal isn't met. In Keep-What-You-Raise campaigns, organizers keep all funds raised, even if the goal isn't reached.",
        },
      ],
    },
    {
      title: "Fees & Security",
      faqs: [
        {
          question: "What fees are involved?",
          answer:
            "We charge a small platform fee of 5% on successful campaigns. Payment processing fees may apply depending on the payment method used. These fees help us maintain the platform and provide support services.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, we use industry-standard encryption and security measures to protect all payment information. We never store your full credit card details on our servers, and all transactions are processed through secure payment gateways.",
        },
      ],
    },
    {
      title: "Verification & Tracking",
      faqs: [
        {
          question: "How do I verify a campaign's legitimacy?",
          answer:
            "All campaigns undergo a verification process. Look for the verified badge, read the campaign details, check the organizer's profile, and review any supporting documentation provided. You can also contact our support team for additional verification.",
        },
        {
          question: "How can I track my donation?",
          answer:
            "After making a donation, you'll receive a confirmation email with a tracking number. You can also log into your account to view your donation history and track the progress of campaigns you've supported.",
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const newIndex = `${categoryIndex}-${faqIndex}`;
    setExpandedIndex(expandedIndex === newIndex ? null : newIndex);
  };

  return (
    <div className={`faq-page ${darkMode ? "dark" : ""}`}>
      <Navbar />
      <div className="faq-container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about our community funding
            platform
          </p>
        </div>

        <div className="faq-grid">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.title}</h2>
              <div className="faq-list">
                {category.faqs.map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className={`faq-item ${
                      expandedIndex === `${categoryIndex}-${faqIndex}`
                        ? "expanded"
                        : ""
                    }`}
                    onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                  >
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      <ChevronDown
                        size={24}
                        className={`chevron ${
                          expandedIndex === `${categoryIndex}-${faqIndex}`
                            ? "expanded"
                            : ""
                        }`}
                      />
                    </div>
                    {expandedIndex === `${categoryIndex}-${faqIndex}` && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="contact-prompt">
          <MessageCircle size={32} className="contact-icon" />
          <h2>Still have questions?</h2>
          <p>
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <a href="/contact" className="contact-button">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
