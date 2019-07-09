import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PrimService} from './prim.service';
import {AStarService} from './a-star.service';
import {Options} from 'ng5-slider';
import {CanvasComponent} from './canvas/canvas.component';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.sass']
})
export class MazeComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: CanvasComponent;

  width = 500;
  height = 500;
  scaleFactor: number = 10;
  scaleFactorOptions: Options = {
    floor: 2,
    ceil: 50,
    showTicks: true,
    hideLimitLabels: true,
    hidePointerLabels: true,
    stepsArray: [
      {value: 2, legend: '2'},
      {value: 4, legend: '4'},
      {value: 5, legend: '5'},
      {value: 10, legend: '10'},
      {value: 20, legend: '20'},
      {value: 25, legend: '25'},
      {value: 50, legend: '50'},
    ],
  };
  delay = 10;
  isResetting = false;
  needsResettingMaze = false;
  needsResettingPath = false;

  constructor(private primService: PrimService,
              private aStarService: AStarService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.canvas.isRunning$()
      .subscribe(
        value => this.scaleFactorOptions = Object.assign({}, this.scaleFactorOptions, {disabled: value})
      );
  }

  generateMaze() {
    this.needsResettingMaze = true;
    this.primService.run(this.width, this.height, this.scaleFactor);
  }

  findPath() {
    this.needsResettingPath = true;
    this.aStarService.run();
  }

  reset() {
    this.primService.reset();
    this.aStarService.reset();

    this.canvas.ngOnDestroy();
    this.canvas.ngOnInit();
    this.needsResettingMaze = false;
    this.needsResettingPath = false;
  }
}

//TODO:
// 2.) what happens if i change scale during drawing
// 1.) fix bug in path finding

