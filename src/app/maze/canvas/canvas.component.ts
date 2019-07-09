import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PrimService} from '../prim.service';
import {Constants} from '../constants';
import {concat, Observable, of, Subject} from 'rxjs';
import {concatMap, debounceTime, delay, first, takeUntil} from 'rxjs/operators';
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

  private _isRunning$: Subject<boolean> = new Subject();
  private _shouldDestroy$: Subject<boolean> = new Subject();

  constructor(private primService: PrimService,
              private aStarService: AStarService) {
  }

  isRunning$(): Observable<boolean> {
    return this._isRunning$.asObservable();
  }

  ngOnInit() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    this.resetCanvas(ctx);

    this.sendStart();

    this.paintTilesFromServices(ctx);

    this.sendStop();
  }

  ngOnDestroy(): void {
    this._shouldDestroy$.next(true);
  }

  private sendStart() {
    concat(this.primService.tiles$(), this.aStarService.tiles$())
      .pipe(
        first()
      )
      .subscribe(() => {
        this._isRunning$.next(true);
      });
  }

  private sendStop() {
    concat(this.primService.tiles$(), this.aStarService.tiles$())
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay))),
        debounceTime(this.delay * 2)
      )
      .subscribe(() => {
        this._isRunning$.next(false);
      });
  }

  private paintTilesFromServices(ctx) {
    concat(this.primService.tiles$(), this.aStarService.tiles$())
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay))),
        takeUntil(this._shouldDestroy$)
      )
      .subscribe(delayedTile => {
        this.paintTile(ctx, delayedTile);
      });
  }

  private resetCanvas(ctx) {
    ctx.fillStyle = Constants.wall;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private paintTile(ctx, currentTile) {
    if (!currentTile) {
      return;
    }
    ctx.fillStyle = currentTile.value;
    ctx.moveTo(currentTile.x, currentTile.y);
    ctx.fillRect(currentTile.x * this.scaleFactor, currentTile.y * this.scaleFactor, this.scaleFactor, this.scaleFactor);
  }

}
