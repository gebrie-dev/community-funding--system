// src/pages/AboutPage.jsx
import Navbar from "../components/Navbar";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />

      <div className="about-container">
        <div className="about-header">
          <h1>About Community Funding</h1>
          <p>Empowering communities through collective support</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              At Community Funding, our mission is to create a platform where
              individuals and organizations can easily raise funds for causes
              that matter. We believe in the power of community and collective
              action to create positive change in the world.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Community Funding was founded in 2023 with a simple idea: make
              fundraising accessible to everyone. What started as a small
              project has grown into a platform that has helped thousands of
              people raise funds for various causes, from disaster relief to
              education and healthcare.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Transparency</h3>
                <p>
                  We believe in complete transparency in all our operations and
                  fundraising campaigns.
                </p>
              </div>
              <div className="value-card">
                <h3>Inclusivity</h3>
                <p>
                  We strive to create a platform that is accessible and
                  inclusive to all individuals and communities.
                </p>
              </div>
              <div className="value-card">
                <h3>Impact</h3>
                <p>
                  We are committed to maximizing the impact of every donation
                  and campaign on our platform.
                </p>
              </div>
              <div className="value-card">
                <h3>Community</h3>
                <p>
                  We foster a sense of community and collective action among our
                  users and partners.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-image">
                  <img src="/images/kal.png" alt="Team Member" />
                </div>
                <h3>Kalab Zewdie</h3>
                <p>Founder & CEO</p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <img src="/images/gavi.png" alt="Team Member" />
                </div>
                <h3>Gebre Wagnew</h3>
                <p>CTO</p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <img src="/images/team-member-3.jpg" alt="Team Member" />
                </div>
                <h3>Michael Johnson</h3>
                <p>Head of Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
