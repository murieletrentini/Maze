import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import {Landscape} from './model';

@Component({
  selector: 'app-ps5',
  templateUrl: './ps5.component.html',
  styleUrls: ['./ps5.component.sass']
})
export class Ps5Component implements OnInit {
  private width = 400;
  private height = 400;
  private theta = 0;
  private p5: p5;
  private land: Landscape;

  constructor() {
  }

  ngOnInit() {
    this.p5 = new p5();
  }

  createClouds() {
    const sketch = (_p5) => {

      _p5.setup = () => {
        this.reset(_p5);
      };

      _p5.draw = () => {
        this.perlinNoise(_p5);
        _p5.noLoop();
        console.log('draw clouds');
      };
    };

    this.p5 = new p5(sketch);
  }

  private perlinNoise(s) {
    s.loadPixels();
    let img = s.createImage(this.width, this.height);
    img.loadPixels();
    let xOff = 0.0;

    for (let x = 0; x < this.width; x++) {
      let yOff = 0.0;

      for (let y = 0; y < this.height; y++) {
        let bright = s.map(s.noise(xOff, yOff), 0, 1, 0, 255); //[bold]
        s.set(x, y, s.color(bright));
        yOff += 0.01;
      }
      xOff += 0.01;
    }
    s.updatePixels();
  }


  reset(_p5) {
    this.p5.noCanvas();
    _p5.createCanvas(this.width, this.height).parent('canvas');
  }

  createHeightMap() {
    const sketch = (_p5: p5) => {

      _p5.setup = () => {
        this.reset(_p5);
        _p5.createCanvas(this.width, this.height, _p5.WEBGL).parent('canvas');
        this.land = new Landscape(20, this.width, this.height, _p5);
        this.land.calculate();
      };

      /**
       * Continuously executed until the program is stopped
       */
      _p5.draw = () => {
        _p5.background(255);
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
}

