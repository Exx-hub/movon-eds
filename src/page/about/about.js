import React from 'react';
import './about.scss';
import { Typography } from 'antd';
import logo from '../../assets/movoncargo.png'

const { Title } = Typography;

function About() {
  return (
    <div className="about-main">
      <div className="container">
        <div className="about-img">
          <img src={logo} alt="movon-logo"/>
        </div>
        <p className="version text">Version: 2.1.0.3</p>
        <div className="about-text">
          <Title>About Us</Title>
          <div className="text" type="secondary">MovOn is the first mobile app in the Philippines that provides the easiest and smartest way to book online bus tickets with guaranteed seats.</div>
          <div className="text" type="secondary">You can search for your destination and choose from a wide choice of bus services based on your preferred bus operator, departure times, prices, bus types, pickup & drop off points. Choose seats & pay securely using credit card, debit card and through thousands of over-the-counter payment centres across the Philippines.</div>
          <div className="text" type="secondary">Book your online bus tickets now! Anytime and Anywhere through the MovOn app.</div>
        </div>
      </div>
    </div>
  );
}

export default About;
