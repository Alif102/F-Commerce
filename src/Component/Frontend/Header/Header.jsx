import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import logo from '../assets/images/logo.png'; // Update the path to your logo image
import 'animate.css'; // Assuming you are using animate.css for the wow animations
import './Header.css'; // Create and import a CSS file for any specific styles

const Header = () => {
  return (
    <header className="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              {/* ***** Logo Start ***** */}
              <Link to="/" className="logo">
                <img src={logo} alt="Chain App Dev" />
              </Link>
              {/* ***** Logo End ***** */}
              {/* ***** Menu Start ***** */}
              <ul className="nav">
                <li className="scroll-to-section"><Link to="#top" className="active">Home</Link></li>
                <li className="scroll-to-section"><Link to="#services">Services</Link></li>
                <li className="scroll-to-section"><Link to="#about">About</Link></li>
                <li className="scroll-to-section"><Link to="#pricing">Pricing</Link></li>
                <li className="scroll-to-section"><Link to="#newsletter">Newsletter</Link></li>
                <li>
                  <div className="gradient-button">
                    <Link to="/login"><i className="fa fa-sign-in-alt"></i> Sign In Now</Link>
                  </div>
                </li>
              </ul>
              <a className='menu-trigger'>
                <span>Menu</span>
              </a>
              {/* ***** Menu End ***** */}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;