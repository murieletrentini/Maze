import {Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Queue} from 'queue-typescript';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() mapMemory = new Queue();

  @ViewChild('canvas') canvas: ElementRef;

  @Input() running: boolean;

  constructor(private ngZone: NgZone) {
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   let ctx = this.canvas.nativeElement.getContext('2d');
  //
  //   if (this.map && this.map[0] && this.map[0][0]) {
  //     requestAnimationFrame(() => this.draw(ctx, {...this.map}));
  //   }
  // }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this._running = false;
  }

  paint() {

  }


  ngOnChanges() {
    if (this.mapMemory.length == 0) {
      return;
    }
    let ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.beginPath();
    const currentMap = this.mapMemory.dequeue();
    for (let x = 0; x < this.width / this.scaleFactor; x++) {
      for (let y = 0; y < this.height / this.scaleFactor; y++) {
        ctx.fillStyle = currentMap[x][y];
        ctx.moveTo(x, y);
        ctx.fillRect(x * this.scaleFactor, y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
      }
    }


    // }, 500);
  }


}
