import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Tile} from '../maze.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() mapMemory: Array<Tile>;

  @ViewChild('canvas') canvas: ElementRef;

  @Input() running: boolean;

  private memoryCounter = 0;
  private timeoutCounter = 1;
  private tileCounter = 0;

  constructor() {
  }

  ngOnInit() {

  }

  private paintMap() {
    if (this.mapMemory.length == 0) {
      return;
    }
    let ctx = this.canvas.nativeElement.getContext('2d');
    setTimeout(() => this.paintTile(ctx), 25 * this.timeoutCounter);
  }

  private paintTile(ctx) {
    ctx.beginPath();
    let currentTile = this.mapMemory[this.tileCounter++];
    ctx.fillStyle = currentTile.value;
    ctx.moveTo(currentTile.x, currentTile.y);
    ctx.fillRect(currentTile.x * this.scaleFactor, currentTile.y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  play() {
    this.reset();
    for (this.memoryCounter = 0; this.memoryCounter < this.mapMemory.length; this.memoryCounter++) {
      this.paintMap();
      this.timeoutCounter++;
    }
  }

  next() {
    if (this.memoryCounter == this.mapMemory.length - 1) {
      return;
    }
    this.memoryCounter++;
    let ctx = this.canvas.nativeElement.getContext('2d');
    this.paintTile(ctx);
  }

  reset() {
    this.memoryCounter = 0;
    this.timeoutCounter = 1;
    this.tileCounter = 0;
    let ctx = this.canvas.nativeElement.getContext('2d');
    ctx.fillStyle = '#979797';
    ctx.fillRect(0, 0, this.width, this.height);
  }

  previous() {
    if (this.memoryCounter <= 0) {
      return;
    }
    this.memoryCounter--;
    let ctx = this.canvas.nativeElement.getContext('2d');
    this.paintTile(ctx);
  }
}
