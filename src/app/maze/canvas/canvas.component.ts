import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PrimService, Tile} from '../prim.service';
import {Constants} from '../constants';
import {concat, of} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';
import {AStarService} from '../a-star.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() scaleFactor: number;
  @Input() delay: number;

  @ViewChild('canvas', {static: true}) canvas: ElementRef;

  @Input() running: boolean;

  constructor(private primService: PrimService,
              private aStarService: AStarService) {
  }

  ngOnInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    concat(this.primService.tiles$(), this.aStarService.tiles$())
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay))),
      )
      .subscribe(delayedTile => {
        this.paintTile(ctx, delayedTile);
      });

    console.log("INIT")
  }

  ngOnDestroy(): void {
    console.log("DESTROY")
  }

  private paintTile(ctx, currentTile) {
    ctx.fillStyle = currentTile.value;
    ctx.moveTo(currentTile.x, currentTile.y);
    ctx.fillRect(currentTile.x * this.scaleFactor, currentTile.y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

}
