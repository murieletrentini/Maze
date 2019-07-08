import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Maze, PrimService} from './prim.service';
import {AStarService} from './a-star.service';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.sass']
})
export class MazeComponent implements OnInit {

  width = 500;
  height = 500;
  scaleFactor = 10;
  delay = 10;
  isResetting = false;
  needsResettingMaze = false;
  needsResettingPath = false;

  constructor(private primService: PrimService,
              private aStarService: AStarService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
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
    this.isResetting = true;
    this.primService.reset();
    this.aStarService.reset();

    // force onDestroy, onInit for canvas component
    this.cd.detectChanges();
    this.isResetting = false;
    this.needsResettingMaze = false;
    this.needsResettingPath = false;
  }
}


