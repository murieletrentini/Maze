import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

declare  global {
  interface Number {
    between(start: number, end: number): boolean
  }
}

Number.prototype.between = function(start: number, end: number): boolean {
  return start <= this && end > this;
};

@Injectable({
  providedIn: 'root'
})
export class GeneticAlgorithmService {

  private _cities$ = new Subject<City[]>();
  get cities$(): Observable<City[]> {
    return this._cities$.asObservable();
  }
  private _fittest$ = new Subject<Individual>();
  get fittest$(): Observable<Individual> {
    return this._fittest$.asObservable();
  }

  private _cities: City[];
  private _population: Individual[];
  private _shortestDistanceEver = Number.MAX_SAFE_INTEGER;
  private _shortestDistanceCurrent: number;

  cityCount = 25;
  generations = 100;
  populationSize = 1000;
  mutationRate = 0.5;
  eliteSize = Math.floor(1 / 100 * this.populationSize);
  private _parentPopulationSize = 1 / 5 * this.populationSize;
  private _maxCountNoImprovement = 5;
  private _countNoImprovement = 0;

  constructor() {
  }

  run() {
    this.generateInitialPopulation();
    let count = 0;
    while (count++ < this.generations && this.stillImproving()) {
      this.calculateFitness();
      this._population.sort((i1, i2) => i2.fitness - i1.fitness);
      this._shortestDistanceCurrent = this._population[0].distance;
      this._fittest$.next(this._population[0]);
      const parents = this.parentSelection();
      this.breeding(parents);
    }
  }

  generateCities(width: number, height: number, circular: boolean) {
    this._cities = [];
    this._population = [];
    this._shortestDistanceEver = Number.MAX_SAFE_INTEGER;
    this._cities$.next([]);
    this._fittest$.next(new Individual());
    if (circular) {
      this.circularCityLayout(width, height);
    } else {
      this.randomCityLayout(width, height);
    }
    this._cities$.next(this._cities);
  }

  private randomCityLayout(width: number, height: number) {
    for (let i = 0; i < this.cityCount; i++) {
      const x = getRandomInt(width - 8) + 4; // account for city circle size (r = 4)
      const y = getRandomInt(height - 8) + 4;
      this._cities.push(new City(x, y));
    }
  }

  private circularCityLayout(width: number, height: number) {
    const r = (2 * height) / 5;

    for (let i = 0; i < this.cityCount; i++) {

      const angle = (i + 1) / this.cityCount * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      this._cities.push(new City(x + width / 2, y + height / 2));
    }
  }

  private generateInitialPopulation() {
    this._population = [];
    for (let i = 0; i < this.populationSize; i++) {
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
  private shuffleArray(originalArray: City[]): City[] {
    let array = Object.assign([], originalArray);
    for (let i = array.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private parentSelection(): Individual[] {
    const parents = [];
    // elitism
    for (let i = 0; i < this.eliteSize; i++) {
      parents.push(this._population[i]);
    }

    // Roulette Wheel Selection
    const totalFitness = this._population.reduce((prev, curr) => prev + curr.fitness, 0);
    this._population.forEach(i => {
      i.proportionalFitness = i.fitness / totalFitness;
    });
    while (parents.length < this._parentPopulationSize) {
      const possibleParent = this._population[getRandomInt(this._population.length - 1)];
      if (Math.random() <= possibleParent.proportionalFitness) {
        parents.push(possibleParent);
      }
    }
    return parents;
  }

  private calculateFitness() {
    this._population.forEach(p => p.calculateFitness());
  }

  private breeding(parents: Individual[]) {
    const nextPopulation = [];

    while (nextPopulation.length < this.populationSize) {
      const p1 = parents[getRandomInt(parents.length - 1)];
      const p2 = parents[getRandomInt(parents.length - 1)];
      const child = new Individual();
      child.cities = this.crossOver(p1, p2);
      this.mutate(child);
      child.calculateDistance();
      nextPopulation.push(child);
    }
    this._population = nextPopulation;
  }

  /**
   * Ordered Cross Over
   * Ensures that every city is visited exactly once in the child path.
   */
  private crossOver(father, mother): City[] {
    const crossOver1 = getRandomInt(this._cities.length);
    const crossOver2 = getRandomInt(this._cities.length);
    const startCrossOver = Math.min(crossOver1, crossOver2);
    const endCrossOver = Math.max(crossOver1, crossOver2);

    const childPathOfP1 = father.cities.slice(startCrossOver, endCrossOver);
    const childPathOfP2 = mother.cities.filter(c => !childPathOfP1.includes(c)).reverse();
    const childPath = [];
    for (let i = 0; i < this._cities.length; i++) {
      if (i.between(startCrossOver, endCrossOver)) {
        childPath[i] = father.cities[i];
      } else {
        childPath[i] = childPathOfP2.pop();
      }
    }
    return childPath;
  }

  /**
   * Uses displacement mutation
   */
  private mutate(child: Individual): void {
    if (Math.random() <= this.mutationRate) {
      const index = getRandomInt(child.cities.length - 1);
      const mutation = child.cities.splice(index);
      child.cities.push(...mutation);
    }
  }

  private stillImproving(): boolean {
    if (this._shortestDistanceCurrent < this._shortestDistanceEver) {
      this._shortestDistanceEver = this._shortestDistanceCurrent;
      this._countNoImprovement = 0;
      return true;
    } else if (this._shortestDistanceCurrent === this._shortestDistanceEver) {
      this._countNoImprovement++;
    }
    return this._countNoImprovement < this._maxCountNoImprovement;
  }
}

/**
 * Generates a random integer up to and including the upper bound
 */
function getRandomInt(upperBound: number): number {
  return Math.floor(Math.random() * upperBound);
}

export class City {
  constructor(public x: number, public y: number) {
  }
}

export class Individual {
  cities: City[] = [];
  distance: number;
  fitness: number;
  proportionalFitness: number;

  calculateDistance() {
    this.distance = this.cities.reduce((prev, curr, i, arr) => {
      let distance = prev;
      if (i >= arr.length - 1) {
        return distance;
      }
      const nextCity = i + 1 == arr.length ? arr[0] : arr[i + 1];
      const currentDistance = Math.abs(curr.x - nextCity.x) + Math.abs(curr.y - nextCity.y);
      return distance + currentDistance;
    }, 0);
  }

  calculateFitness() {
    if (this.distance === 0) {
      this.calculateDistance();
    }
    this.fitness = 1 / this.distance * 10000;
  }
}
