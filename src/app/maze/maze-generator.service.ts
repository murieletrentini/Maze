import {Injectable} from '@angular/core';
import {Constants} from './constants';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MazeGeneratorService {
  private _map;
  private _maze;

  private _width: number;
  private _scaleFactor: number;
  private _height: number;

  private _tiles: Subject<Tile> = new Subject();

  constructor() {
  }

  tiles$(): Observable<Tile> {
    return this._tiles.asObservable();
  }

  getMaze(): any {
    return this._maze;
  }

  reset() {
    this._tiles = new Subject();
    this.initializeMap();
  }

  run(width: number, height: number, scaleFactor: number) {
    this._width = width;
    this._height = height;
    this._scaleFactor = scaleFactor;

    this.initializeMap();
    this.primAlgorithm();
  }

  primAlgorithm() {

    const r = this._height / this._scaleFactor;
    const c = this._width / this._scaleFactor;

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

      let op: Point = cu.opposite();
      try {
        // if both tile and its opposite are walls
        if (this._map[cu.x][cu.y] == Constants.wall) {
          if (this._map[op.x][op.y] == Constants.wall) {

            // open path between the nodes
            this._map[cu.x][cu.y] = Constants.path;
            this._tiles.next(new Tile(cu.x, cu.y, Constants.path));
            this._map[op.x][op.y] = Constants.path;
            this._tiles.next(new Tile(op.x, op.y, Constants.path));

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
        this._map[last.x][last.y] = Constants.end;
        let endTile = new Tile(last.x, last.y, Constants.end);
        this._tiles.next(endTile);
        this._maze.end = endTile;
        // this.draw();
        console.log(`Marking end point: (${last.x}, ${last.y})`);
      }
    }
    this._tiles.complete();
  }

  private initializeMap() {
    this._map = {};
    this._maze = new Maze(this._map);
    // add one more tile, so we always have a wall at each end
    for (let x = 0; x < this._width / this._scaleFactor + 1; x++) {
      this._map[x] = {};
      for (let y = 0; y < this._height / this._scaleFactor + 1; y++) {
        this._map[x][y] = Constants.wall;
      }
    }
  }

  private getRandomEntry(set: Set<Point>): Point {
    const entries = Array.from(set);
    return entries[Math.floor(Math.random() * entries.length)];
  }

  private addNeighboursToFrontier(current, frontier: Set<Point>) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x == 0 && y == 0 || x != 0 && y != 0) {
          // ignore diagonal neighbours
          continue;
        }
        try {
          // ignore path-tiles
          if (this._map[current.x + x][current.y + y] == Constants.path) {
            continue;
          }
        } catch (e) {
          // ignore ArrayIndexOutOfBounds
          continue;
        }
        // add eligible points to frontier
        let eligibleNeighbour = new Point(current.x + x, current.y + y, current);
        frontier.add(eligibleNeighbour);
      }
    }
  }

  private generateStart(c, r) {
    // add odd starting coordinates, so we always have a wall at each end
    let x = Math.floor(Math.random() * c);
    x = x % 2 === 0 ? x + 1 : x;
    let y = Math.floor(Math.random() * r);
    y = y % 2 === 0 ? y + 1 : y;
    const start = <Point> {
      x: x,
      y: y
    };

    this._map[start.x][start.y] = Constants.start;
    let startTile = new Tile(start.x, start.y, Constants.start);
    this._tiles.next(startTile);
    this._maze.generateCities = startTile;

    console.log(`Generating start point: (${start.x}, ${start.y})`);
    return start;
  }

}

export class Tile {
  constructor(public x: number, public y: number, public value: string) {
  }
}

export class Maze {
  start: Tile;
  end: Tile;

  constructor(public map: any) {
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
