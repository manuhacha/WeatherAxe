import { Component, Input, signal } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { HourlyWeather } from '../../../Models/HourlyWeather';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {
  //Creamos un input para que el componente padre pase los datos
  @Input() data:HourlyWeather[] = [];
  //Creamos arrays de temperaturas y fechas para pasar al chart
  protected readonly temperatures = signal<number[]>([]);
  protected readonly dates = signal<string[]>([]);
  protected readonly icons = signal<string[]>([]);
  protected readonly precipitation_probability = signal<number[]>([]);
  protected readonly precipitation = signal<number[]>([]);

  ngOnInit() {
    //Insertamos valores en cada array y formateamos las fechas
    this.temperatures.set(this.data.map(hourlyWeather => hourlyWeather.temperature));
    this.dates.set(this.data.map(hourlyWeather => this.formatDates(hourlyWeather.time)));
    this.icons.set(this.data.map(hourlyWeather => hourlyWeather.icon));
    this.precipitation_probability.set(this.data.map(hourlyWeather => hourlyWeather.precipitation_probability));
    this.precipitation.set(this.data.map(hourlyWeather => hourlyWeather.precipitation_probability));

    //Pasamos los datos al chart pra poder renderizarlo
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Temperature',
          data: this.temperatures(),
        },
        {
          name: 'Precipitation',
          data: this.precipitation(),
          
        },
      ],
      labels: this.dates(),
    };
  }

  public chartOptions: Partial<ChartOptions> = {
    chart: {
      width: '1500',
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      height: 350,
      zoom: {
        enabled: false,
      },
      foreColor: 'white',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
      colors: ['oklch(54.6% 0.245 262.881)', 'oklch(62.7% 0.194 149.214)']
    },
    xaxis: {
      type: 'category',
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        offsetX: -10,
      },
    },
    legend: {
      horizontalAlign: 'left',
      formatter: function(seriesName) {
        return seriesName + `${ seriesName === 'Temperature' ? ' (ºC)' : ' (mm)'}`;
      }   
    },
  };

  //Formateamos fechas para devolver 18/05 y 05:45
  formatDates(date:Date) {
    const d = new Date(date);
    let formatted = '';
    if (d.getHours() === 0) {
    formatted = new Intl.DateTimeFormat("en-GB", {
      day: '2-digit',
      month: 'short'
    }).format(d);
    }
    else {
    formatted = new Intl.DateTimeFormat("en-GB", {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    }
    
    return formatted;
  }

}
