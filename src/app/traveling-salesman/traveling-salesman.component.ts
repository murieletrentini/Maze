import {Component, OnInit, ViewChild} from '@angular/core';
import {City, GeneticAlgorithmService, Individual} from './genetic-algorithm.service';
import {Observable, of} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';
import {Options} from 'ng5-slider';
import {ChartComponent} from './chart/chart.component';

@Component({
  selector: 'app-traveling-salesman',
  templateUrl: './traveling-salesman.component.html',
  styleUrls: ['./traveling-salesman.component.sass']
})
export class TravelingSalesmanComponent implements OnInit {
  @ViewChild('chart', {static: false}) chart: ChartComponent;

  width = 500;
  height = 500;
  viewBox = `0 0 ${this.width} ${this.height}`;

  cities$: Observable<City[]>;
  progression: Individual[] = [];
  paths: Path[];
  delayOptions: Options = {
    floor: 100,
    ceil: 5000,
  };
  delay = 500;

  constructor(private geneticAlgorithm: GeneticAlgorithmService) {
  }

  ngOnInit() {
    this.cities$ = this.geneticAlgorithm.cities$();
    this.geneticAlgorithm.fittest$()
      .pipe(
        concatMap(fittest => of(fittest).pipe(delay(this.delay))),
      )
      .subscribe(delayedFittest => {
        this.progression.push(delayedFittest);
        this.chart.addData(delayedFittest.distance, this.progression.length);
        this.paths = [];
        let cities = delayedFittest.cities;
        for (let i = 0; i < cities.length; i++) {
          const nextIndex = i == cities.length - 1 ? 0 : i + 1;
          this.paths.push(new Path(cities[i].x, cities[i].y, cities[nextIndex].x, cities[nextIndex].y));
        }
      });
  }

  generateCities() {
    this.paths = [];
    this.geneticAlgorithm.generateCities(this.width, this.height, 50);
  }

  run() {
    this.geneticAlgorithm.run();
  }
}

class Path {
  constructor(public startX: number, public startY: number, public endX: number, public endY: number) {

  }
}
