import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartData = {
    chartType: 'BarChart',
    dataTable: [
      ['Task', 'Hours per Day'],
      ['Work', 11],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 2],
      ['Sleep', 7]
    ],
    options: {
      'title': 'Tasks', subtitle: 'This is a subtitle',
      annotations: {
        textStyle: {
          fontName: 'Times-Roman',
          fontSize: 18,
          bold: true,
          italic: true,
          // The color of the text.
          color: '#871b47',
          // The color of the text outline.
          auraColor: '#d799ae',
          // The transparency of the text.
          opacity: 0.8
        }
      },
    //   legend: 'none',
    //   tooltip: {
    //     trigger: 'none',
    //   },
    //   chartArea: {
    //     left: 200,
    //     top: 0,
    //     width: '100%',
    //     height: '100%',
    //   },
    //   vAxis: {
    //     textStyle: {
    //       fontName: 'Roboto',
    //       fontSize: 16,
    //     },
    //   },
    //   bar: {groupWidth: '70%'},
    //   width: 500,
    //   hAxis: {
    //     textPosition: 'none',
    //     gridlines: {
    //       color: 'transparent',
    //     },
    //   },
    },
  };

  constructor() {
  }

  ngOnInit() {
  }

}
