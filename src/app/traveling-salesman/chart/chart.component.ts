import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {
  data;
  options = {
    view: [400, 200],
    xAxisLabel: 'Generation',
    yAxisLabel: 'Distance',
    colorScheme: {
      domain: ['#8400ff']
    },
    showYAxis: true,
    showXAxis: true,
    gradient: false,
    autoScale: false,
    showLegend: false,
    showXAxisLabel: true,
    showYAxisLabel: true,
    timeline: false
  };

  constructor() {
  }

  ngOnInit() {
    this.data = [
      {
        name: 'Fittest',
        series: []
      }
    ];
  }

  addData(distance: number, generation: number) {
    this.data[0].series.push({name: generation, value: distance});
    // kick angular change detection
    this.data = [...this.data];
  }

  onSelect($event: any) {
    console.log($event);
  }
}
