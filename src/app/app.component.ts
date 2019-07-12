import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'path-finder';
}
// @Component({
//   selector: 'app-root',
//   template: `
//     <ngx-charts-line-chart
//       [view]="view"
//       [scheme]="options.colorScheme"
//       [results]="multi"
//       [gradient]="options.gradient"
//       [xAxis]="options.showXAxis"
//       [yAxis]="options.showYAxis"
//       [legend]="options.showLegend"
//       [showXAxisLabel]="options.showXAxisLabel"
//       [showYAxisLabel]="options.showYAxisLabel"
//       [xAxisLabel]="options.xAxisLabel"
//       [yAxisLabel]="options.yAxisLabel"
//       [autoScale]="options.autoScale"
//       [timeline]="options.timeline"
//       (select)="onSelect($event)">
//     </ngx-charts-line-chart>
//   `
// })
// export class AppComponent implements OnInit {
//   single: any[];
//   multi: any[];
//
//   view: any[] = [700, 400];
//
//   // options
//   options = {
//     showXAxis: true,
//     showYAxis: true,
//     gradient: false,
//     showLegend: true,
//     showXAxisLabel: true,
//     xAxisLabel: 'Number',
//     showYAxisLabel: true,
//     yAxisLabel: 'Color Value',
//     timeline: true,
//
//     colorScheme: {
//       domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
//     },
//
//     // line, area
//     autoScale: true,
//   };
//
//
//   constructor() {
//   }
//
//   ngOnInit(): void {
//     this.multi = [
//       {
//         name: 'Cyan',
//         series: [
//           {
//             name: 5,
//             value: 2650
//           },
//           {
//             name: 10,
//             value: 2800
//           },
//           {
//             name: 15,
//             value: 2000
//           }
//         ]
//       },
//       {
//         name: 'Yellow',
//         series: [
//           {
//             name: 5,
//             value: 2500
//           },
//           {
//             name: 10,
//             value: 3100
//           },
//           {
//             name: 15,
//             value: 2350
//           }
//         ]
//       }
//     ];
//   }
//
//   onSelect(event) {
//     console.log(event);
//   }
//
// }
