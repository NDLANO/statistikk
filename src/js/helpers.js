export function findMinYValue(dataset) {
  // * Default min value is 0
  let minYValue = 0;

  // * Loop through data and find minimum
  for (let i = 0; i < dataset.chartDataCollection.datasets.length; i++) {
    console.log(
      "LineChartView.yMinValue: data " + i + " = ",
      dataset.chartDataCollection.datasets[i].data
    );
    let numArray = dataset.chartDataCollection.datasets[i].data.map((item) =>
      parseFloat(item)
    );
    console.log("LineChartView.yMinValue: numArray = ", numArray);
    let tmpMin = Math.min(...numArray);

    // * if found min value is < registered min value keep it
    if (tmpMin < minYValue) minYValue = tmpMin;
  }

  // * Floor to make sure the value isn't .5 (Vuetify bug)
  minYValue = Math.floor(minYValue);

  return minYValue;
}
