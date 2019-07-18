import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import {Landscape, Mover2D} from './model';

@Component({
  selector: 'app-ps5',
  templateUrl: './nature-of-code.component.html',
  styleUrls: ['./nature-of-code.component.sass']
})
export class NatureOfCodeComponent implements OnInit {
  private width = 400;
  private height = 400;
  private theta = 0;
  private p5: p5;
  private land: Landscape;

  private backgroundColor = '#979797';

  constructor() {
  }

  ngOnInit() {
    this.p5 = new p5(null);
    setTimeout(() => this.p5.createCanvas(this.width, this.height).parent('canvas'), 100);

  }

  reset(context: p5, use3D: boolean) {
    this.p5.noLoop();
    this.p5.noCanvas();
    if (use3D) {
      context.createCanvas(this.width, this.height, context.WEBGL).parent('canvas');
    } else {
      context.createCanvas(this.width, this.height).parent('canvas');
    }
  }

  createClouds() {
    const sketch = (context: p5) => {
      context.preload = () => {
        this.width = window.innerWidth;
      };

      context.setup = () => {
        this.reset(context, false);
      };

      context.draw = () => {
        this.perlinNoise(context);
        context.noLoop();
      };
    };

    this.p5 = new p5(sketch);
  }


  private perlinNoise(context: p5) {
    context.loadPixels();
    let img = context.createImage(this.width, this.height);
    img.loadPixels();
    let xOff = 0.0;

    for (let x = 0; x < this.width; x++) {
      let yOff = 0.0;

      for (let y = 0; y < this.height; y++) {
        let bright = context.map(context.noise(xOff, yOff), 0, 1, 0, 255);
        context.set(x, y, context.color(bright));
        yOff += 0.01;
      }
      xOff += 0.01;
    }
    context.updatePixels();
  }

  createHeightMap() {
    const sketch = (context: p5) => {
      context.preload = () => {
        this.width = 400;
      };

      context.setup = () => {
        this.reset(context, true);
        this.land = new Landscape(20, this.width, this.height, context);
        this.land.calculate();
      };

      /**
       * Continuously executed until the program is stopped
       */
      context.draw = () => {
        context.background(this.backgroundColor);
        context.push();
        context.translate(this.width / 10, this.height / 10, -500);
        context.rotateX(Math.PI / 3);
        context.rotateZ(this.theta);
        this.land.render();
        context.pop();

        this.theta += 0.0025;
      };
    };

    this.p5 = new p5(sketch);
  }

  bounceBall3D() {
    let location;
    let velocity;
    let ballSize = 16;

    const sketch = (context: p5) => {
      context.preload = () => {
        this.width = window.innerWidth;
      };

      context.setup = () => {
        this.reset(context, true);
        location = context.createVector(100, 100, 100);
        velocity = context.createVector(2.5, 5, 7.5);
      };

      /**
       * Continuously executed until the program is stopped
       */
      context.draw = () => {
        context.background(this.backgroundColor);

        location.add(velocity);
        if ((location.x > this.width - ballSize / 2) || (location.x < ballSize / 2)) {
          velocity.x = velocity.x * -1;
        }
        if ((location.y > this.height - ballSize / 2) || (location.y < ballSize / 2)) {
          velocity.y = velocity.y * -1;
        }
        if ((location.z > this.height - ballSize / 2) || (location.z < ballSize / 2)) {
          velocity.z = velocity.z * -1;
        }

        context.push();
        context.translate(location.x - 500, location.y - 200, location.z - 500);
        context.sphere(ballSize);
        context.pop();
      };
    };

    this.p5 = new p5(sketch);
  }

  bounceBall() {
    let ball: Mover2D;
    let ballSize = 16;
    const color = '#FFFFFF';

    const sketch = (context: p5) => {
      context.preload = () => {
        this.width = window.innerWidth;
        ball = new Mover2D(context, 'circle', ballSize);
      };

      context.setup = () => {
        this.reset(context, false);
        ball.location = context.createVector(this.width / 2, this.height / 2);
        ball.velocity = context.createVector(0,0);
        ball.acceleration = context.createVector(0.1,0.01);
      };

      /**
       * Continuously executed until the program is stopped
       */
      context.draw = () => {
        ball.update();
        ball.checkEdges();
        ball.display(this.backgroundColor, color, color);
      };
    };

    this.p5 = new p5(sketch);
  }
}

