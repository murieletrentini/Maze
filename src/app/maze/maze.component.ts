import {Component, OnInit, ViewChild} from '@angular/core';
import {MazeGeneratorService} from './maze-generator.service';
import {PathFinderService} from './path-finder.service';
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
  delayOptions: Options = {
    floor: 0,
    ceil: 100,
  };
  delay = 10;
  needsResettingMaze = false;
  needsResettingPath = false;

  constructor(private mazeGeneratorService: MazeGeneratorService,
              private pathFinderService: PathFinderService) {
  }

  ngOnInit(): void {
    this.canvas.isRunning$()
      .subscribe(
        // create new object to trigger angular change detection
        value => this.scaleFactorOptions = Object.assign({}, this.scaleFactorOptions, {disabled: value})
      );
  }

  generateMaze() {
    this.needsResettingMaze = true;
    this.mazeGeneratorService.run(this.width, this.height, this.scaleFactor);
  }

  findPath() {
    this.needsResettingPath = true;
    this.pathFinderService.run();
  }

  reset() {
    this.mazeGeneratorService.reset();
    this.pathFinderService.reset();

    this.canvas.ngOnDestroy();
    this.canvas.ngOnInit();
    this.needsResettingMaze = false;
    this.needsResettingPath = false;
  }
}
