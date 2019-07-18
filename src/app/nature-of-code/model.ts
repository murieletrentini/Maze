import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

export class Landscape {

  scl;           // size of each cell
  w;
  h;           // width and height of thingie
  rows;
  cols;    // number of rows and columns
  zOff = 0.0;  // perlin noise argument
  z: number[][];
  private _p5: p5;

  // using an array to store all the height values

  constructor(scl_, w_, h_, p5) {
    this.scl = scl_;
    this.w = w_;
    this.h = h_;
    this.cols = this.w / this.scl;
    this.rows = this.h / this.scl;
    this.z = [];
    for (let rows = 0; rows < this.rows; rows++) {
      this.z[rows] = [];
    }
    this._p5 = p5;
  }


// Calculate height values
  calculate(): void {
    let xOff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yOff = 0;
      for (let j = 0; j < this.rows; j++) {
        this.z[i][j] = this._p5.map(this._p5.noise(xOff, yOff, this.zOff), 0, 1, -120, 120);
        yOff += 0.1;
      }
      xOff += 0.1;
    }
    this.zOff += 0.01;
  }

// Render landscape as grid of quads
  render(): void {
    // Every cell is an individual quad
    for (let x = 0; x < this.z.length - 1; x++) {
      this._p5.beginShape(this._p5.TRIANGLE_STRIP);
      for (let y = 0; y < this.z[x].length; y++) {
        // one quad at a time
        // each quad's color is determined by the height value at each vertex
        // (clean this part up)
        this._p5.stroke(0);
        const currentElevation = this.z[x][y];
        const currentShade = this._p5.map(currentElevation, -120, 120, 0, 255);
        this._p5.fill(currentShade, 255);
        const xCoordinate = x * this.scl - this.w / 2;
        const yCoordinate = y * this.scl - this.h / 2;
        this._p5.vertex(xCoordinate, yCoordinate, this.z[x][y]);
        this._p5.vertex(xCoordinate + this.scl, yCoordinate, this.z[x + 1][y]);
      }
      this._p5.endShape();
    }
  }
}
