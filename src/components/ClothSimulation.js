// src/components/ClothSimulation.js
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const ClothSimulation = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let cols, rows, cloth;
      const spacing = 10;
      const stiffness = .01;
      const damping = .9;
      const mouseInfluenceRadius = 20;
      const mouseForceStrength = 12;
      let prevMouseX, prevMouseY;

      class Particle {
        constructor(x, y, fixed) {
          this.pos = p.createVector(x, y);
          this.originalPos = p.createVector(x, y);
          this.fixed = fixed;
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
        }

        applyForce(force) {
          if (!this.fixed) {
            this.acc.add(force);
          }
        }

        update() {
          if (!this.fixed) {
            // Calculate mouse movement vector
            let mouseVel = p.createVector(p.mouseX - prevMouseX, p.mouseY - prevMouseY);
            let d = p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
            
            if (d < mouseInfluenceRadius) {
              // Create directional force based on mouse movement
              let angle = mouseVel.heading();
              let strength = p.map(d, 0, mouseInfluenceRadius, mouseForceStrength, 0);
              
              // Apply force perpendicular to mouse movement for ripple effect
              let perpForce = p.createVector(
                Math.cos(angle + Math.PI/2),
                Math.sin(angle + Math.PI/2)
              );
              
              // Scale force based on mouse velocity and distance
              let velMag = mouseVel.mag();
              perpForce.mult(strength * velMag * 0.1);
              
              // Add slight push in mouse movement direction
              let pushForce = mouseVel.copy().mult(0.05 * strength);
              
              this.applyForce(perpForce);
              this.applyForce(pushForce);
            }

            // Update physics
            this.vel.add(this.acc);
            this.vel.mult(damping);
            this.pos.add(this.vel);
            this.acc.mult(0);

            // Return to original position
            let returnForce = p5.Vector.sub(this.originalPos, this.pos);
            returnForce.mult(0.02);
            this.applyForce(returnForce);

            // Constrain maximum displacement
            let displacement = p5.Vector.sub(this.pos, this.originalPos);
            let maxDisplacement = spacing * 1.5;
            if (displacement.mag() > maxDisplacement) {
              displacement.setMag(maxDisplacement);
              this.pos = p5.Vector.add(this.originalPos, displacement);
            }
          }
        }
      }

      class Spring {
        constructor(p1, p2) {
          this.p1 = p1;
          this.p2 = p2;
          this.length = spacing;
        }

        update() {
          let force = p5.Vector.sub(this.p2.pos, this.p1.pos);
          let x = force.mag() - this.length;
          force.normalize();
          force.mult(stiffness * x);
          this.p1.applyForce(force);
          force.mult(-1);
          this.p2.applyForce(force);
        }

        display() {
          p.stroke(0);
          p.strokeWeight(1);
          p.line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y);
        }
      }

      class Cloth {
        constructor(cols, rows) {
          this.particles = [];
          this.springs = [];

          for (let i = 0; i < cols; i++) {
            this.particles[i] = [];
            for (let j = 0; j < rows; j++) {
              const fixed = j === 0;
              this.particles[i][j] = new Particle(i * spacing, j * spacing, fixed);
            }
          }

          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              if (i > 0) {
                this.springs.push(new Spring(this.particles[i][j], this.particles[i - 1][j]));
              }
              if (j > 0) {
                this.springs.push(new Spring(this.particles[i][j], this.particles[i][j - 1]));
              }
            }
          }
        }

        update() {
          for (const spring of this.springs) {
            spring.update();
          }
          for (const row of this.particles) {
            for (const particle of row) {
              particle.update();
            }
          }
        }

        display() {
          p.clear();
          p.background(255);
          for (const spring of this.springs) {
            spring.display();
          }
        }
      }

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(255);
        cols = Math.floor(p.width / spacing);
        rows = Math.floor(p.height / spacing);
        cloth = new Cloth(cols, rows);
        prevMouseX = p.mouseX;
        prevMouseY = p.mouseY;
      };

      p.draw = () => {
        cloth.update();
        cloth.display();
        prevMouseX = p.mouseX;
        prevMouseY = p.mouseY;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        cols = Math.floor(p.width / spacing);
        rows = Math.floor(p.height / spacing);
        cloth = new Cloth(cols, rows);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);
    return () => p5Instance.remove();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="cloth-canvas"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: '1',
        backgroundColor: '#fff'
      }}
    />
  );
};

export default ClothSimulation;