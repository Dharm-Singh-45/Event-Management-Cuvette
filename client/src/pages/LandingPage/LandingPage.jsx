import React from "react";
import "./LandingPage.css";
import Logo from "../../assets/logo.png";
import Screen1 from "../../assets/screen 1.png";
import Screen2 from "../../assets/Fantastical 1.png";
import Screen3 from "../../assets/screen 3.png";
import Star from "../../assets/star.png";
import TestimonialCard from "../../components/LandingPageComp/TestimonialCard.jsx";
import AppsIntegration from "../../components/LandingPageComp/AppsIntegration.jsx";
import Audiowave from "../../assets/audio.png";
import Bandsintown from "../../assets/Bandsintown.png";
import Bonfire from "../../assets/Bonfire.png";
import books from "../../assets/books.png";
import Cameo from "../../assets/Cameo.png";
import ClubHouse from "../../assets/ClubHouse.png";
import Contact from "../../assets/Contact.png";
import Community from "../../assets/Community.png";
import Gift from "../../assets/Gift.png";
import LandingFooter from "../../components/LandingPageComp/LandingFooter.jsx";

import { useNavigate } from "react-router-dom";

const integrationsData = [
  {
    imgSrc: Audiowave,
    title: "Audiomack",
    description: "Add an Audiomack player to your Linktree",
  },
  {
    imgSrc: Bandsintown,
    title: "Bandsintown",
    description: "Drive ticket sales by listing your events",
  },
  {
    imgSrc: Bonfire,
    title: "Bonfire",
    description: "Display and sell your custom merch",
  },
  {
    imgSrc: books,
    title: "Books",
    description: "Promote books on your Linktree",
  },
  {
    imgSrc: Gift,
    title: "Buy Me A Gift",
    description: "Let visitors support you with a small gift",
  },
  {
    imgSrc: Cameo,
    title: "Cameo",
    description: "Make impossible fan connections possible",
  },
  {
    imgSrc: ClubHouse,
    title: "ClubHouse",
    description: "Let your community in on the conversation",
  },
  {
    imgSrc: Community,
    title: "Community",
    description: "Build an SMS subscriber list",
  },
  {
    imgSrc: Contact,
    title: "Contact",
    description: "Easily share downloadable contact details",
  },
];

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="top-bar">
          <div className="logo">
            <img src={Logo} alt="logo" />
            <span>CNNCT</span>
          </div>
          <div className="signup-btn" onClick={()=>navigate('/signup')}>Sign up free</div>
        </div>
        <div className="header-section">
          CNNCT-Easy <br />
          Scheduling Ahead
        </div>
        <button onClick={()=>navigate('/signup')}>Sign up free</button>
        <div className="screen1">
          <img src={Screen1} alt="screen1" />
        </div>
        <div className="sections">
          <div className="section1">
            <span>Simplified scheduling for you and your team</span>
            <p>
              CNNCT eliminates the back-and-forth of scheduling meetings so you
              can focus on what matters. Set your availability, share your link,
              and let others book time with you instantly.
            </p>
          </div>
          <div className="section2">
            <div className="section2-left">
              <p>Stay Organized with Your</p>
              <p> Calendar & Meetings</p>
              <div className="section2-left-list">
                <span>Seamless Event Scheduling</span>
                <ul>
                  <li>
                    View all your upcoming meetings and appointments in one
                    place.
                  </li>
                  <li>
                    Syncs with Google Calendar, Outlook, and iCloud to avoid
                    conflicts
                  </li>
                  <li>
                    Customize event types: one-on-ones, team meetings, group <br />
                    sessions, and webinars.
                  </li>
                </ul>
              </div>
            </div>
            <div className="section2-right">
              <div className="section2-right-img1">
                <img src={Screen2} alt="screen2" />
              </div>
              <div className="section2-right-img2">
                <img src={Screen3} alt="screen3" />
              </div>
            </div>
          </div>
          <div className="section3">
            <div className="section3-left">
              <span>
                Here's what our
                <span className="highlight-customer">customer</span> <br /> has
                to says
              </span>
              <button>Read customer stories</button>
            </div>
            <div className="section3-right">
              <img src={Star} alt="star" />
              <span>
                [short description goes in here] <br /> lorem ipsum is a
                placeholder text to <br /> demonstrate.
              </span>
            </div>
          </div>
          <div className="section4">
            <div className="section4-top">
              <TestimonialCard />
              <TestimonialCard />
            </div>
            <div className="section4-bottom">
              <TestimonialCard />
              <TestimonialCard />
            </div>
          </div>
          <section className="section5">
            <h1>All Link Apps and Integrations</h1>
            <div className="apps-grid">
              {integrationsData.map((item, index) => (
                <AppsIntegration
                  key={index}
                  imgSrc={item.imgSrc}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </section>
          <div className="section6">
            <LandingFooter/>
          </div>
        </div>
        
       
      </div>
    </>
  );
};

export default LandingPage;
