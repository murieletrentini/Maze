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

  private _cities: City[];
  private _cities$ = new Subject<City[]>();
  private _fittest$ = new Subject<Individual>();
  private _fittest: Individual[] = [];
  private _population: Individual[];

  private _populationSize = 500;
  private _eliteSize = 20;
  private _parentPopulationSize = 50;
  private _generations = 50;
  private _mutationRate = 0.5;

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
    while (count++ < this._generations && this.stillImproving()) {
      this.calculateFitness();
      this._population.sort((i1, i2) => i2.fitness - i1.fitness);
      this._fittest.push(this._population[0]);
      this._fittest$.next(this._population[0]);
      const parents = this.parentSelection();
      this.breeding(parents);
    }
  }

  generateCities(width: number, height: number, cityCount: number) {
    this._cities = [];
    this._cities$.next([]);
    for (let i = 0; i < cityCount; i++) {
      const x = getRandomInt(width);
      const y = getRandomInt(height);
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
    for (let i = 0; i < this._eliteSize; i++) {
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

    while (nextPopulation.length < this._populationSize) {
      const p1 = parents[getRandomInt(parents.length - 1)];
      const p2 = parents[getRandomInt(parents.length - 1)];
      if (!p1 || !p2) {
        debugger;
      }
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
    if (Math.random() <= this._mutationRate) {
      const index = getRandomInt(child.cities.length - 1);
      const mutation = child.cities.splice(index);
      child.cities.push(...mutation);
    }
  }

  private stillImproving() {
    if (this._fittest.length < 3) {
      return true;
    }
    let childFitness = this._fittest[this._fittest.length - 1].fitness;
    let grandfatherFitness = this._fittest[this._fittest.length - 3].fitness;
    return childFitness > grandfatherFitness;
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
  cities: City[];
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
