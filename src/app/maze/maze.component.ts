import {Component, OnInit} from '@angular/core';
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
  timeout = 25;
  isReady = false;
  maze: Maze;

  constructor(private primService: PrimService,
              private aStarService: AStarService) {
  }

  ngOnInit() {
  }


  generateMaze() {
    this.isReady = false;
    this.maze = this.primService.run(this.width, this.height, this.scaleFactor);
    this.isReady = true;
  }

  findPath() {
    this.maze.mapMemory = this.aStarService.run(this.maze);
  }
}


