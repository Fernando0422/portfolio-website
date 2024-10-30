import React from 'react';
import './Home.css';
import ClothSimulation from './ClothSimulation';

function Home() {
  return (
    <div className="home-container">
      <div className="cloth-background">
        <ClothSimulation />
      </div>
      <div className="content-wrapper">
        <div className="text-content">
          <p className="intro-small-text">HELLO THERE!</p>
          <h1 className="intro-main-text">
            I'm Fernando Rojas,<br />
            a creative Frontend<br />
            developer.
            <img 
            src="/images/contact.png" 
            alt="Contact Me" 
            className="contact-icon"
          />

          </h1>
        </div>
   
      </div>
    </div>
  );
}

export default Home;
