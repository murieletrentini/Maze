import {Component, OnInit} from '@angular/core';
import {City, GeneticAlgorithmService, Individual} from './genetic-algorithm.service';
import {Observable, of} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-traveling-salesman',
  templateUrl: './traveling-salesman.component.html',
  styleUrls: ['./traveling-salesman.component.sass']
})
export class TravelingSalesmanComponent implements OnInit {
  width = 500;
  height = 500;
  viewBox = `0 0 ${this.width} ${this.height}`;

  cities$: Observable<City[]>;
  fittest: Individual;
  progression: Individual[] = [];
  paths: Path[];
  delayOptions: Options = {
    floor: 0,
    ceil: 100,
  };
  delay = 15000;

  constructor(private geneticAlgorithm: GeneticAlgorithmService) {
  }

  ngOnInit() {
    this.cities$ = this.geneticAlgorithm.cities$();
    this.geneticAlgorithm.fittest$()
      .pipe(
        concatMap(tile => of(tile).pipe(delay(this.delay))),
      )
      .subscribe(fittest => {
        this.fittest = fittest;
        this.progression.push(fittest);
        this.paths = [];
        let cities = fittest.cities;
        for (let i = 0; i < cities.length; i++) {
          const nextIndex = i == cities.length - 1 ? 0 : i + 1;
          this.paths.push(new Path(cities[i].x, cities[i].y, cities[nextIndex].x, cities[nextIndex].y));
        }
      });
  }

  generateCities() {
    this.paths = [];
    this.geneticAlgorithm.generateCities(this.width, this.height, 10);
  }

  run() {
    this.geneticAlgorithm.run();
  }
}

class Path {
  constructor(public startX: number, public startY: number, public endX: number, public endY: number) {

  }
}
