import {Component, OnInit} from '@angular/core';
import {City, GeneticAlgorithmService, Individual} from './genetic-algorithm.service';
import {Observable} from 'rxjs';

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
  paths: Path[];

  constructor(private geneticAlgorithm: GeneticAlgorithmService) {
  }

  ngOnInit() {
    this.cities$ = this.geneticAlgorithm.cities$();
    this.geneticAlgorithm.fittest$().subscribe(fittest => {
      this.fittest = fittest;
      this.paths = [];
      let cities = fittest.cities;
      for (let i = 0; i < cities.length; i++) {
        if (i >= cities.length - 1) {
          continue;
        }
        this.paths.push(new Path(cities[i].x, cities[i].y, cities[i + 1].x, cities[i + 1].y));
      }
    });
  }

  generateCities() {
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
