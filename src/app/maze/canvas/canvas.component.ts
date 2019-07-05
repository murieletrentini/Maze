import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() mapMemory: Array<any>;

  @ViewChild('canvas') canvas: ElementRef;

  @Input() running: boolean;

  counter = 0;

  private timeOutCounterTile = 1;
  private timeOutCounterMap = 1;

  constructor() {
  }

  private paintMap() {
    if (this.mapMemory.length == 0) {
      return;
    }
    let ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.beginPath();

    for (let x = 0; x < this.width / this.scaleFactor; x++) {
      for (let y = 0; y < this.height / this.scaleFactor; y++) {
        setTimeout(() => this.paintTile(ctx, x, y, this.counter), 100 * this.timeOutCounterMap + 100 * this.timeOutCounterTile++);
      }
    }
  }

  private paintTile(ctx, x: number, y: number, counter: number) {
    let currentMap = this.mapMemory[counter];
    ctx.fillStyle = currentMap[x][y];
    ctx.moveTo(x, y);
    ctx.fillRect(x * this.scaleFactor, y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  play() {
    for (this.counter = 0; this.counter < this.mapMemory.length - 1; this.counter++) {
      this.paintMap();
      this.timeOutCounterMap++;
    }
  }


  next() {
    if (this.counter == this.mapMemory.length - 1) {
      return;
    }
    this.counter++;
    this.paintMap();
  }

  reset() {
    this.counter = 0;
    this.timeOutCounterTile = 1;
    this.timeOutCounterMap = 1;
    this.paintMap();
  }

  previous() {
    if (this.counter <= 0) {
      return;
    }
    this.counter--;
    this.paintMap();
  }
}
