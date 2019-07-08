import {Injectable} from '@angular/core';
import {Maze, Tile} from './prim.service';
import {Constants} from './constants';
import {Stack} from 'stack-typescript';

@Injectable({
  providedIn: 'root'
})
export class AStarService {
  private _start: Tile;
  private _end: Tile;
  private _map: any;
  private _mapMemory: Tile[];

  private open: AStarTile[] = [];
  private close: AStarTile[] = [];

  constructor() {
  }

  run(maze: Maze): Tile[] {
    this._start = maze.start;
    this._end = maze.end;
    this._map = maze.map;
    this._mapMemory = [];

    this.aStar();

    return this._mapMemory;
  }

  private aStar() {
    let start = new AStarTile(this._start.x, this._start.y, null);
    start.g = 0;
    start.h = this.heuristic(start.x, start.y);
    this.open.push(start);

    while (this.open.length > 0) {
      const currentTile = minFValue(this.open);

      // switch Tile from open to closed list
      this.close.push(currentTile);
      this.open.splice(this.open.indexOf(currentTile), 1);

      if (currentTile.x == this._end.x && currentTile.y == this._end.y) {
        console.log('Path found!');
        break;
      }

      this.addNeighbours(currentTile);
    }

    this.markSolutionFinding();
    this.markSolution();

  }

  private markSolutionFinding() {
    this.close.forEach(t => {
      let tile = new Tile(t.x, t.y, Constants.solutionCandidate);
      if (!this.isStartPoint(t) && !this.isEndPoint(t)) {
        return this._mapMemory.push(tile);
      }
    });
  }

  private isStartPoint(t: AStarTile) {
    return this.isSameTile(t, this._start);
  }

  private isEndPoint(t: AStarTile) {
    return this.isSameTile(t, this._end);
  }

  private isSameTile(s: AStarTile, t: Tile): boolean {
    return s.x == t.x && s.y == t.y;
  }

  private markSolution() {
    let current = this.close.find(t => this.isEndPoint(t));
    do {
      if (!this.isStartPoint(current) && !this.isEndPoint(current)) {
        this._mapMemory.push(new Tile(current.x, current.y, Constants.solution));
      }
      current = current.parent;
    } while (current.parent);
  }


  private addNeighbours(current: AStarTile) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x == 0 && y == 0 || x != 0 && y != 0) {
          // ignore diagonal neighbours
          continue;
        }
        const neighbourX = current.x + x;
        const neighbourY = current.y + y;
        try {
          // ignore path-tiles
          if (this._map[neighbourX][neighbourY] == Constants.wall) {
            continue;
          }
          // ignore if already on closed list
          if (this.close.find(t => t.x == neighbourX && t.y == neighbourY)) {
            continue;
          }

          let neighbour = this.open.find(t => t.x == neighbourX && t.y == neighbourY);
          if (neighbour) {
            if (neighbour.g > current.g + 1) {
              //  found better path to existing neighbour
              neighbour.parent = current;
              neighbour.g = current.g + 1;
              neighbour.h = this.heuristic(neighbour.x, neighbour.y);
            }
          } else {
            // add new neighbour to open list
            neighbour = new AStarTile(neighbourX, neighbourY, current);
            neighbour.g = current.g + 1;
            neighbour.h = this.heuristic(neighbour.x, neighbour.y);
            this.open.push(neighbour);
          }
        } catch (e) {
          // ignore ArrayIndexOutOfBounds
        }
      }
    }
  }

  heuristic(x: number, y: number): number {
    // Manhattan
    return Math.abs(x - this._end.x) + Math.abs(y - this._end.y);
  }
}

class AStarTile {
  x: number;
  y: number;
  h: number = -1;
  g: number = -1;
  parent: AStarTile;

  constructor(x: number, y: number, parent: AStarTile) {
    this.x = x;
    this.y = y;
    this.parent = parent;
  }

  f(): number {
    if (this.h == -1 || this.g == -1) {
      throw new Error('Set g and h first!');
    }
    return this.g + this.h;
  }

}


function minFValue(arr: AStarTile[]) {
  const min = Math.min.apply(null, arr.map(t => t.f()));
  return arr.find(t => t.f() == min);
}
