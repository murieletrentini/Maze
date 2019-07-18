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

  reset(_p5: p5, use3D: boolean) {
    this.p5.noLoop();
    this.p5.noCanvas();
    if (use3D) {
      _p5.createCanvas(this.width, this.height, _p5.WEBGL).parent('canvas');
    } else {
      _p5.createCanvas(this.width, this.height).parent('canvas');
    }
  }

  createClouds() {
    const sketch = (_p5: p5) => {
      _p5.preload = () => {
        this.width = window.innerWidth;
      };

      _p5.setup = () => {
        this.reset(_p5, false);
      };

      _p5.draw = () => {
        this.perlinNoise(_p5);
        _p5.noLoop();
      };
    };

    this.p5 = new p5(sketch);
  }


  private perlinNoise(_p5: p5) {
    _p5.loadPixels();
    let img = _p5.createImage(this.width, this.height);
    img.loadPixels();
    let xOff = 0.0;

    for (let x = 0; x < this.width; x++) {
      let yOff = 0.0;

      for (let y = 0; y < this.height; y++) {
        let bright = _p5.map(_p5.noise(xOff, yOff), 0, 1, 0, 255);
        _p5.set(x, y, _p5.color(bright));
        yOff += 0.01;
      }
      xOff += 0.01;
    }
    _p5.updatePixels();
  }

  createHeightMap() {
    const sketch = (_p5: p5) => {
      _p5.preload = () => {
        this.width = 400;
      };

      _p5.setup = () => {
        this.reset(_p5, true);
        this.land = new Landscape(20, this.width, this.height, _p5);
        this.land.calculate();
      };

      /**
       * Continuously executed until the program is stopped
       */
      _p5.draw = () => {
        _p5.background(this.backgroundColor);
        _p5.push();
        _p5.translate(this.width / 10, this.height / 10, -500);
        _p5.rotateX(Math.PI / 3);
        _p5.rotateZ(this.theta);
        this.land.render();
        _p5.pop();

        this.theta += 0.0025;
      };
    };

    this.p5 = new p5(sketch);
  }

  bounceBall3D() {
    let location;
    let velocity;
    let ballSize = 16;

    const sketch = (_p5: p5) => {
      _p5.preload = () => {
        this.width = window.innerWidth;
      };

      _p5.setup = () => {
        this.reset(_p5, true);
        location = _p5.createVector(100, 100, 100);
        velocity = _p5.createVector(2.5, 5, 7.5);
      };

      /**
       * Continuously executed until the program is stopped
       */
      _p5.draw = () => {
        _p5.background(this.backgroundColor);

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

        // _p5.noStroke();
        // _p5.fill('#ffffff');
        _p5.push();
        _p5.translate(location.x - 500, location.y - 200, location.z - 500);
        _p5.sphere(ballSize);
        _p5.pop();
      };
    };

    this.p5 = new p5(sketch);
  }

  bounceBall() {
    const ball = new Mover2D('circle', 16);
    const color = '#FFFFFF';

    const sketch = (_p5: p5) => {
      _p5.preload = () => {
        this.width = window.innerWidth;
      };

      _p5.setup = () => {
        this.reset(_p5, false);
        ball.location = _p5.createVector(100, 100);
        ball.velocity = _p5.createVector(2.5, 5);
      };

      /**
       * Continuously executed until the program is stopped
       */
      _p5.draw = () => {
        ball.update();
        ball.checkEdges(this.width, this.height);
        ball.display(_p5, this.backgroundColor, color, color);
      };
    };

    this.p5 = new p5(sketch);
  }
}

