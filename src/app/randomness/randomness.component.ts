import {Component, OnInit} from '@angular/core';
import OpenSimplexNoise from 'open-simplex-noise';

@Component({
  selector: 'app-paint-splatter',
  templateUrl: './randomness.component.html',
  styleUrls: ['./randomness.component.sass']
})
export class RandomnessComponent implements OnInit {
  width = 100;
  height = 100;
  viewBox = `${-this.width / 2} ${-this.height / 2} ${this.width} ${this.height}`;
  splatters: Splatter[] = [];
  noise: Splatter[] = [];
  currentView: string;

  constructor() {
  }

  ngOnInit() {

  }

  generatePaintSplatter() {
    this.currentView = 'splatter';
    this.splatters = [];

    const start = -50;
    const end = 50;
    const centerX = 0;
    const centerY = 0;
    const sampleSize = 2000;

    for (let i = 0; i < sampleSize; i++) {
      const rndPositionRadius = this.getRandomGaussian(start, end);
      const rndAngle = Math.random() * 2 * Math.PI;
      const x = centerX + rndPositionRadius * Math.cos(rndAngle);
      const y = centerY + rndPositionRadius * Math.sin(rndAngle);
      const splatterRadius = 5 / (Math.abs(rndPositionRadius) + 1);
      this.splatters.push(new Splatter(x, y, splatterRadius, '#ffffff'));
    }

  }

  // using central limit theorem
  private getRandomGaussian(start, end): number {
    let gaussian = 0;
    const sampleSize = 20;

    for (let i = 0; i < sampleSize; i += 1) {
      gaussian += Math.random();
    }

    gaussian = gaussian / sampleSize;

    return start + gaussian * (end - start + 1);
  }

  generateNoise() {
    this.noise = [];
    this.currentView = 'noise';

    const openSimplex = new OpenSimplexNoise(Date.now());

    let xOffset = 0.0;

    let positionOffset = 1;

    for (let x = -this.width / 2; x < this.width / 2; x += positionOffset) {
      let yOffset = 0.0;

      for (let y = -this.height / 2; y < this.height / 2; y += positionOffset) {
        const r = Math.floor((openSimplex.noise2D(x, y) + 1) * 128);
        const g = Math.floor((openSimplex.noise2D(x + 1, y) + 1) * 128);
        const b = Math.floor((openSimplex.noise2D(x + 2, y) + 1) * 128);
        const hex = '#' + r.toString(16) + g.toString(16) + b.toString(16);
        this.noise.push(new Splatter(x, y, positionOffset/2, hex));

        yOffset += 0.01;
      }
      xOffset += 0.01;
    }
  }
}


class Splatter {
  constructor(public x: number, public y: number, public r: number, public color: string) {

  }
}
