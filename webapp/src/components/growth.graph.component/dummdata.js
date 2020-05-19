export const dummyGraphData = {
  labels: (() => {
    const result = [];
    const startingDate = new Date();
    startingDate.setFullYear(startingDate.getFullYear() - 2);
    for (let i = 0; i < 100; i++) {
      result.push(startingDate.setMonth(startingDate.getMonth() + 1))
    }
    return result;
  })(),
  datasets:[{
    label: 'Income over time',
    data: (() => {
      const result = [];
      for (let i = 0; i < 100; i++) {
        result.push(0 + Math.random(0 , 1) * 50000);
      }
      return result;
    })(),
    pointRadius: 3,
    pointBackgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#636363',
    backgroundColor: 'rgba(173, 173, 173, 0.1)',
  }]
};