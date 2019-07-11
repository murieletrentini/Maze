import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneticAlgorithmService {

  private _cities: City[];
  private _cities$ = new Subject<City[]>();
  private _fittest$ = new Subject<Individual>();
  private _height: number;
  private _width: number;
  private _population: Individual[];
  private _populationSize = 50;
  private _generations = 50;

  constructor() {
  }

  cities$(): Observable<City[]> {
    return this._cities$.asObservable();
  }

  fittest$(): Observable<Individual> {
    return this._fittest$.asObservable();
  }

  run() {
    this.generateInitialPopulation();

    let count = 0;
    while (count++ < this._generations) {
      this._population.sort((i1, i2) => i1.distance - i2.distance);
      this._fittest$.next(this._population[0]);
    }
  }

  generateCities(width: number, height: number, cityCount: number) {
    this._width = width;
    this._height = height;

    this._cities = [];
    for (let i = 0; i < cityCount; i++) {
      const x = Math.floor(Math.random() * this._width);
      const y = Math.floor(Math.random() * this._height);
      this._cities.push(new City(x, y));
    }
    this._cities$.next(this._cities);
  }

  private generateInitialPopulation() {
    this._population = [];
    for (let i = 0; i < this._populationSize; i++) {
      const individual = new Individual();
      individual.cities = this.shuffleArray(this._cities);
      individual.calculateDistance();
      this._population.push(individual);
    }
  }

  /**
   * Generates a new array with shuffled content
   * @param originalArray to be copied and shuffled
   */
  shuffleArray(originalArray: City[]): City[] {
    let array = Object.assign([], originalArray);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export class City {
  constructor(public x: number, public y: number) {
  }
}

export class Individual {
  cities: City[];
  distance: number;

  calculateDistance() {
    this.distance = this.cities.reduce((prev, curr, i, arr) => {
      let distance = prev;
      if (i >= arr.length - 2) {
        return distance;
      }
      const nextCity = arr[i + 1];
      const currentDistance = Math.abs(curr.x - nextCity.x) + Math.abs(curr.y - nextCity.y);
      return distance + currentDistance;
    }, 0);
  }
}
