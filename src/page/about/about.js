import React from "react";
import "./about.scss";
import logo from "../../assets/movon.png";
import { config } from "../../config";
import { Layout, Button } from "antd";

import { alterPath } from "../../utility";

import {
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Header, Footer } = Layout;

function About(props) {
  return (
    <Layout className="about-main">
      <Header className="home-header-view">
        <Button className="back-button-header" type="link" onClick={() => props.history.push(alterPath("/"))}> <ArrowLeftOutlined /> Home </Button>
      </Header>
      
      <Layout>
      <div className="container">
        <div>
          <div className="about-img">
            <img className="img-movon-logo" src={logo} alt="movon-logo" />
            <div className="versionContainer">
              <span className="version text">{config.version.environment} {config.version.build}</span>
            </div>
          </div>
          <div className="about-text">
            <p className="title">About Us</p>
            <p>
              MovOn is the first mobile app in the Philippines that provides the
              easiest and smartest way to book online bus tickets with
              guaranteed seats.
            </p>
            <p>
              You can search for your destination and choose from a wide choice
              of bus services based on your preferred bus operator, departure
              times, prices, bus types, pickup & drop off points. Choose seats &
              pay securely using credit card, debit card and through thousands
              of over-the-counter payment centres across the Philippines.
            </p>
            <p>
              Book your online bus tickets now! Anytime and Anywhere through the
              MovOn app.
            </p>
          </div>
        </div>
      </div>
      </Layout>
    
      <Footer className="footer">
        
      </Footer>
    </Layout>
  );
}

export default About;
