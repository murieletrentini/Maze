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

export class Mover2D {
  location: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;

  private topSpeed = 10;

  constructor(private context: p5, public form: string, public width: number, public height: number = width) {

  }

  update() {
    let mouse = this.context.createVector(this.context.mouseX, this.context.mouseY);
    let dir = p5.Vector.sub(mouse, this.location);
    dir.normalize();
    dir.mult(0.05);

    this.acceleration = dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.location.add(this.velocity);
  }

  checkEdges() {
    if ((this.location.x > this.context.width - this.width / 2) || (this.location.x < this.width / 2)) {
      this.velocity.x = this.velocity.x * -1;
    }
    if ((this.location.y > this.context.height - this.height / 2) || (this.location.y < this.height / 2)) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  display(backgroundColor, strokeColor: string, fillColor: string) {
    this.context.background(backgroundColor);
    this.context.stroke(strokeColor);
    this.context.fill(fillColor);
    this.context[this.form](this.location.x, this.location.y, this.width);
  }

}
