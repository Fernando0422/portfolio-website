// src/components/About.js
import React, { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

function About() {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
    });

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        return scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
    });

    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();

    return () => {
      scroll.destroy();
      ScrollTrigger.removeEventListener('refresh', () => scroll.update());
    };
  }, []);

  return (
    <div data-scroll-container className="about-container">
      <section className="scroll-title">
        <h1>About Me</h1>
      </section>
      <section className="content-section">
        <p>Building the web, one creative interaction at a time.</p>
      </section>
      <section className="lerp-section">
        <p>I'm Fernando Rojas, a passionate frontend developer who loves merging creativity and code.</p>
        <p>Fluent in JavaScript, CSS animations, React, and pushing boundaries.</p>
        <p>I believe in creating memorable digital experiences.</p>
        <p>Excited to bring fresh, dynamic ideas to a forward-thinking team.</p>
      </section>
    </div>
  );
}

export default About;
