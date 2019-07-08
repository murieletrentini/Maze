import {Component, OnInit} from '@angular/core';
import {PrimService} from './prim.service';

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
  mapMemory = [];

  constructor(private primService: PrimService) {
  }

  ngOnInit() {
  }


  generateMaze() {
    this.isReady = false;
    this.mapMemory = [];
    this.mapMemory = this.primService.run(this.width, this.height, this.scaleFactor);
    this.isReady = true;
  }


  findPath() {

  }
}


