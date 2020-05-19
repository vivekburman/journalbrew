import React from 'react';
import { Line } from 'react-chartjs-2';
import './growth.graph.component.scss';
import { dummyGraphData } from './dummdata';


export const GrowthGraph = (props) => {
  const { incomeGraphData=dummyGraphData, totalAmount=0 } = props;

  return (
    <div className="chart-container">
      <h2 className="header">Income Statistics</h2>
      <div className="total-amount">Total: {totalAmount}</div>
      <section className="income-graph-container">
        <Line 
          data={incomeGraphData}
          responsive={true}
          options={{ 
            maintainAspectRatio: false,
            legend: {
              display: false              
            },
            scales: {
              x: {
                type: 'linear',
              },
              xAxes: [{
                type: 'time',
                gridLines: {
                  display: false
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5,
                  maxRotation: 0,
                  minRotation: 0,
                  fontSize: 12,
                  fontStyle: '500'
                }
              }],
              yAxes: [{
                scaleLabel: {
                  display: false,
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5,
                  callback: function (value, index, values) {
                    if (value < 1000) {
                      return value;
                    } else if (value < 100000) {
                      return ((value / 1000).toFixed(0) + 'K');
                    } else {
                      return ((value / 1000000).toFixed(0) + 'L');
                    }
                  },
                  stepSize: 1000,
                  fontSize: 12,
                  fontStyle: '500'
                }
              }]
            } 
            }}/>
      </section>
    </div>
  );
};