import {Component, OnInit} from '@angular/core';
import {GeneticAlgorithmService} from '../genetic-algorithm.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  constructor(private geneticAlgorithm: GeneticAlgorithmService) { }

  ngOnInit() {
  }

}
