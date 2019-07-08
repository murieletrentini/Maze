import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PrimService, Tile} from '../prim.service';
import {Constants} from '../constants';
import {of} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';
import {AStarService} from '../a-star.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() delay: number;
  @Input() mapMemory: Array<Tile>;

  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  @Input() running: boolean;

  // Are actually counters for the same: the current place in the memory map.
  // But both are needed, because of the delay of the paint action:
  // When painting is run (after the delay) the memoryCounter has already reached its end
  private memoryCounter = 0;
  private tileCounter = 0;

  private timeoutCounter = 0;
  private scheduledTimeouts: number[] = [];


  constructor(private primService: PrimService,
              private aStarService: AStarService) {
  }

  ngOnInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    this.primService.tiles$()
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay)))
      )
      .subscribe(delayedTile => {
        this.paintTile(ctx, delayedTile);
      });

    this.aStarService.tiles$()
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay)))
      )
      .subscribe(delayedTile => {
        this.paintTile(ctx, delayedTile);
      });
  }

  private paintTile(ctx, currentTile) {
    ctx.fillStyle = currentTile.value;
    ctx.moveTo(currentTile.x, currentTile.y);
    ctx.fillRect(currentTile.x * this.scaleFactor, currentTile.y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
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
