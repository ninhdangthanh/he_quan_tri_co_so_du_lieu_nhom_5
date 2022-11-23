var xValues = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
var yValues =  getValueYColumnChart()
// var yValues = [55, 49, 44, 24, 
//                 40, 50, 24, 51, 
//                 52, 53, 43, 43];
var barColors = ["red", "green","blue","#2faf1a",
                "#2b999f", "violet", "black", "gray",
                "pink", "navy", "purple", 'orange'];


function getValueYColumnChart() {
  axios({
      method: 'get',
      url: `/api/v1/grade/chart/column-chart`,
  })
  .then(function (response) {
      yValues = response.data.map(i => {
          return i.total
      })
      new Chart("myChart", {
          type: "bar",
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            legend: {display: false},
            title: {
              display: true,
              text: "Tổng lượt đánh giá theo từng tháng qua tất cả các năm"
            }
          }
        });
  })
  .catch(function (error) {
      console.log(error);
  });
}


var x1Values = ["A", "B", "C", "P", "Z"];
var y1Values = [55, 49, 44, 24, 15];
var bar1Colors = [
  "blue",
  "red",
  "orange",
  "green",
  "#2b999f",
];

function getValue1LineChart() {
  axios({
      method: 'get',
      url: `/api/v1/grade/chart/doughnut-chart`,
  })
  .then(function (response) {
    y1Values = response.data.filter((i, index) => {
      return index < 5
    }).map(item => item.total)
    new Chart("myChart1", {
      type: "doughnut",
      data: {
        labels: x1Values,
        datasets: [{
          backgroundColor: bar1Colors,
          data: y1Values
        }]
      },
      options: {
        title: {
          display: true,
          text: "Tổng từng loại đánh giá"
        }
      }
    });
  })
  .catch(function (error) {
      console.log(error);
  });
}

getValue1LineChart()