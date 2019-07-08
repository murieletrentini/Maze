import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Tile} from '../prim.service';
import {Constants} from '../constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() timeout: number;
  @Input() mapMemory: Array<Tile>;

  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  @Input() running: boolean;

  // Are actually counters for the same: the current place in the memory map.
  // But both are needed, because of the timeout of the paint action:
  // When painting is run (after the timeout) the memoryCounter has already reached its end
  private memoryCounter = 0;
  private tileCounter = 0;

  private timeoutCounter = 0;
  private scheduledTimeouts: number[] = [];

  constructor() {
  }

  ngOnInit() {

  }

  private paintTile(ctx) {
    ctx.beginPath();
    let currentTile = this.mapMemory[this.tileCounter++];
    ctx.fillStyle = currentTile.value;
    ctx.moveTo(currentTile.x, currentTile.y);
    ctx.fillRect(currentTile.x * this.scaleFactor, currentTile.y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

  play(resetMaze: boolean) {
    if (this.mapMemory.length == 0) {
      return;
    }
    this.reset(resetMaze);
    let ctx = this.canvas.nativeElement.getContext('2d');
    for (this.memoryCounter = 0; this.memoryCounter < this.mapMemory.length; this.memoryCounter++) {
      this.scheduledTimeouts.push(setTimeout(() => this.paintTile(ctx), this.timeout * this.timeoutCounter++));
    }
  }

  reset(resetMaze: boolean) {
    this.memoryCounter = 0;
    this.timeoutCounter = 1;
    this.tileCounter = 0;
    if (resetMaze) {
      let ctx = this.canvas.nativeElement.getContext('2d');
      ctx.fillStyle = Constants.wall;
      ctx.fillRect(0, 0, this.width, this.height);
      this.scheduledTimeouts.forEach(t => clearTimeout(t));
    }

  }
}
