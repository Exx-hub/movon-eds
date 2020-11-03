import React from 'react';
import './about.scss';
import logo from '../../assets/movon.png'
import {config} from '../../config';

function About() {
  return (
    <div className="about-main">
      <div className="container">
        <div className="about-img">
          <img className="img-movon-logo" src={logo} alt="movon-logo"/>
          <span className="version text">Version: {config.version.build}</span>
        </div>
      </div>
      <div className="about-text">
          <span className="title">About Us</span>
          <p>
            MovOn is the first mobile app in the Philippines that provides the easiest and smartest way to book online bus tickets with guaranteed seats.
          </p>
          <p>
            You can search for your destination and choose from a wide choice of bus services based on your preferred bus operator, departure times, prices, bus types, pickup & drop off points. Choose seats & pay securely using credit card, debit card and through thousands of over-the-counter payment centres across the Philippines.
          </p>
          <p>Book your online bus tickets now! Anytime and Anywhere through the MovOn app.</p>
        </div>
    </div>
  );
}

export default About;
