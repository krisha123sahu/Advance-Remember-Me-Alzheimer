import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          💙 Remember Me
        </div>

        <div className="nav-links">

          <Link to="/">Home</Link>

          <a href="#features">Features</a>

          <a href="#about">About</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>

        </div>

      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="tagline">
            SMARTER CARE FOR BETTER TOMORROWS
          </p>

          <h1>
            Because Every
            <span>Memory Matters</span>
          </h1>

          <p className="hero-text">
            A simple and caring digital platform designed to support
            Alzheimer's patients, families and caregivers.
          </p>

          <div className="hero-buttons">

            <Link to="/signup" className="primary-btn">
              Get Started
            </Link>

            <a href="#features" className="secondary-btn">
              Learn More
            </a>

          </div>

        </div>


        {/* Hero Card */}
        <div className="hero-card">

          <div className="heart">
            🧠
          </div>

          <h2>
            Remember Me
          </h2>

          <p>
            Care, connection and technology
            working together.
          </p>

        </div>

      </section>


      {/* Features Section */}
      <section className="features" id="features">

        <h2>
          How We Can Help
        </h2>

        <div className="feature-container">

          {/* Memory Support */}
          <div className="feature-card">

            <div>🧠</div>

            <h3>
              Memory Support
            </h3>

            <p>
              Keep important memories, people and moments organized.
            </p>

          </div>


          {/* Smart Reminders */}
          <div className="feature-card">

            <div>🔔</div>

            <h3>
              Smart Reminders
            </h3>

            <p>
              Helpful reminders for medicines, appointments and routines.
            </p>

            <Link to="/reminders" className="feature-link">
              Open Reminders →
            </Link>

          </div>


          {/* Caregiver Support */}
          <div className="feature-card">

            <div>👨‍👩‍👧</div>

            <h3>
              Caregiver Support
            </h3>

            <p>
              Help caregivers stay connected and informed.
            </p>

          </div>


          {/* AI Care Assistant */}
          <div className="feature-card">

            <div>🤖</div>

            <h3>
              AI Care Assistant
            </h3>

            <p>
              Get intelligent assistance with patient information,
              reminders and everyday care management.
            </p>

            <Link to="/ai-assistant" className="feature-link">
              Open AI Assistant →
            </Link>

          </div>

        </div>

      </section>


      {/* About / Mission Section */}
      <section className="about" id="about">

        <div className="about-content">

          <p className="tagline">
            OUR MISSION
          </p>

          <h2>
            Technology With a Human Touch
          </h2>

          <p>
            Remember Me is designed to make Alzheimer's care simpler,
            safer and more connected. Our goal is to help patients,
            caregivers and families stay connected with the things
            that matter most.
          </p>


          <div className="about-points">

            <div>

              <span>💙</span>

              <h3>
                Compassionate Care
              </h3>

              <p>
                Technology designed with care and simplicity.
              </p>

            </div>


            <div>

              <span>🛡️</span>

              <h3>
                Safe & Secure
              </h3>

              <p>
                Keeping important information protected.
              </p>

            </div>


            <div>

              <span>🤖</span>

              <h3>
                Smart Assistance
              </h3>

              <p>
                AI-powered features to support everyday care.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <h2>
              💙 Remember Me
            </h2>

            <p>
              Making Alzheimer's care simpler,
              safer and more connected.
            </p>

          </div>


          <div className="footer-links">

            <h3>
              Quick Links
            </h3>

            <Link to="/">
              Home
            </Link>

            <a href="#features">
              Features
            </a>

            <a href="#about">
              About
            </a>

          </div>


          <div className="footer-contact">

            <h3>
              Support
            </h3>

            <p>
              Caregiver Support
            </p>

            <p>
              Patient Assistance
            </p>

            <Link to="/reminders">
              Smart Reminders
            </Link>

            <Link to="/ai-assistant">
              AI Care Assistant
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 Remember Me. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;