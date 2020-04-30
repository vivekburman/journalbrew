import React from 'react';
import { Line } from 'react-chartjs-2';
import './growth.graph.component.scss';
const dummyGraphData = {
    labels: ['jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets:[{
      label: 'Income over time',
      data: [0, 0, 22, 43, 33, 456, 3112, 21, 333, 444, 555, 32],
      backgroundColor: [
        'rgba(52, 235, 168, 1)',
      ],
      borderWidth: 2
    }]
};
export const GrowthGraph = (props) => {
  const { incomeGraphData=dummyGraphData, viewsGraphData=dummyGraphData } = props;
  return (
    <div className="chart-container">
      <section className="income-graph-container">
        <Line 
          data={incomeGraphData}
          responsive={true}
          options={{ 
            maintainAspectRatio: false,
            legend: {
              position: 'bottom'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Income'
                }
              }]
            } 
            }}/>
      </section>
      <section className="views-graph-container">
        <Line 
          data={viewsGraphData}
          responsive={true}
          options={{ 
            maintainAspectRatio: false,
            legend: {
              position: 'bottom'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Views'
                }
              }]
            } 
            }}/>
      </section>
    </div>
  );
};