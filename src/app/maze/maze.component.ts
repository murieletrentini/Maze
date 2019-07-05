import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.sass']
})
export class MazeComponent implements OnInit {

  width = 500;
  height = 500;

  private _wall = '#979797';
  private _path = '#ffffff';
  private _start = '#0772ff';
  private _end = '#ff1613';
  private _scaleFactor = 50;
  private _map;
  private _mapMemory = [];


  constructor() {
  }

  ngOnInit() {


  }


  initializeMap() {
    this._mapMemory = [];
    this._map = {};
    for (let x = 0; x < this.width / this._scaleFactor; x++) {
      this._map[x] = {};
      for (let y = 0; y < this.height / this._scaleFactor; y++) {
        this._map[x][y] = this._wall;
      }
    }
  }

  generateMaze() {
    this.initializeMap();
    this.primAlgorithm();
  }

  primAlgorithm() {
    const r = this.height / this._scaleFactor;
    const c = this.width / this._scaleFactor;

    // pick random reset point
    const start = this.generateStart(c, r);

    // iterate through direct neighbours of starting point
    const frontier: Set<Point> = new Set<Point>();
    this.addNeighboursToFrontier(start, frontier);

    let last: Point = start;

    while (frontier.size != 0) {

      // pick current tile at random
      let cu: Point = this.getRandomEntry(frontier);
      frontier.delete(cu);
      console.log(`current random entry: (${cu.x}, ${cu.y})`);

      let op: Point = cu.opposite();
      try {
        // if both tile and its opposite are walls
        if (this._map[cu.x][cu.y] == this._wall) {
          if (this._map[op.x][op.y] == this._wall) {

            // open path between the nodes
            this._map[cu.x][cu.y] = this._path;
            this._mapMemory.push(new Tile(cu.x, cu.y, this._path));
            this._map[op.x][op.y] = this._path;
            this._mapMemory.push(new Tile(op.x, op.y, this._path));

            // store last tile in order to mark it later
            last = op;

            // iterate through direct neighbors of tile, same as earlier
            this.addNeighboursToFrontier(op, frontier);
          }
        }
      } catch (e) {
        // ignore NullPointer and ArrayIndexOutOfBounds
      }

      // if algorithm has resolved, mark end point
      if (frontier.size == 0) {
        this._map[last.x][last.y] = this._end;
        this._mapMemory.push(new Tile(last.x, last.y, this._end));
        // this.draw();
        console.log(`Marking end point: (${last.x}, ${last.y})`);
      }
    }
  }

  private getRandomEntry(set: Set<Point>): Point {
    const entries = Array.from(set);
    return entries[Math.floor(Math.random() * entries.length)];
  }

  private addNeighboursToFrontier(start, frontier: Set<Point>) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x == 0 && y == 0 || x != 0 && y != 0) {
          // ignore diagonal neighbours
          continue;
        }
        try {
          // ignore path-tiles
          if (this._map[start.x + x][start.y + y] == this._path) {
            continue;
          }
        } catch (e) {
          // ignore ArrayIndexOutOfBounds
          continue;
        }
        // add eligible points to frontier
        let eligibleNeighbour = new Point(start.x + x, start.y + y, start);
        frontier.add(eligibleNeighbour);
        console.log(`Adding neighbour: (${eligibleNeighbour.x}, ${eligibleNeighbour.y})`);
      }
    }
  }

  private generateStart(c, r) {
    const start = <Point> {
      x: Math.floor(Math.random() * c),
      y: Math.floor(Math.random() * r)
    };

    this._map[start.x][start.y] = this._start;
    this._mapMemory.push(new Tile(start.x, start.y, this._start));

    console.log(`Generating start point: (${start.x}, ${start.y})`);
    return start;
  }
}

export class Tile {
  constructor(public x: number, public y: number, public value: string) {
  }
}

class Point {

  constructor(public x: number, public y: number, public parent: Point) {
  }

  public opposite(): Point {
    if (this.x - this.parent.x != 0) {
      return new Point(this.x + this.x - this.parent.x, this.y, this);
    }
    if (this.y - this.parent.y != 0) {
      return new Point(this.x, this.y + this.y - this.parent.y, this);
    }
    return null;
  }

}
