import {Injectable} from '@angular/core';
import {MazeGeneratorService, Tile} from './maze-generator.service';
import {Constants} from './constants';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PathFinderService {
  private _start: Tile;
  private _end: Tile;
  private _map: any;

  private _open: AStarTile[] = [];
  private _close: AStarTile[] = [];

  private _tiles$: Subject<Tile> = new Subject();

  constructor(private mazeGeneratorService: MazeGeneratorService) {
  }

  tiles$(): Observable<Tile> {
    return this._tiles$.asObservable();
  }

  reset() {
    this._tiles$ = new Subject();
    this._open = [];
    this._close = [];
  }

  run() {
    const maze = this.mazeGeneratorService.getMaze();
    if (!maze) {
      console.error('Needs a maze');
      return;
    }
    this._start = maze.start;
    this._end = maze.end;
    this._map = maze.map;

    this.aStarAlgorithm();
  }

  private aStarAlgorithm() {
    let start = new AStarTile(this._start.x, this._start.y, null);
    start.g = 0;
    start.h = this.heuristic(start.x, start.y);
    this._open.push(start);

    while (this._open.length > 0) {
      const currentTile = minFValue(this._open);

      // switch Tile from _open to closed list
      this._close.push(currentTile);
      this.drawPath(currentTile);
      this._open.splice(this._open.indexOf(currentTile), 1);

      if (currentTile.x == this._end.x && currentTile.y == this._end.y) {
        console.log('Path found!');
        break;
      }

      this.addNeighbours(currentTile);
    }

    this.markSolution();
  }


  private drawPath(currentTile) {
    if (!this.isStartPoint(currentTile) && !this.isEndPoint(currentTile)) {
      this._tiles$.next(new Tile(currentTile.x, currentTile.y, Constants.solutionCandidate));
    }
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
    let current = this._close.find(t => this.isEndPoint(t));
    do {
      if (!this.isStartPoint(current) && !this.isEndPoint(current)) {
        this._tiles$.next(new Tile(current.x, current.y, Constants.solution));
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
          // ignore wall-tiles
          if (this._map[neighbourX][neighbourY] == Constants.wall) {
            continue;
          }
          // ignore if already on closed list
          if (this._close.find(t => t.x == neighbourX && t.y == neighbourY)) {
            continue;
          }

          let neighbour = this._open.find(t => t.x == neighbourX && t.y == neighbourY);
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
            this._open.push(neighbour);
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
