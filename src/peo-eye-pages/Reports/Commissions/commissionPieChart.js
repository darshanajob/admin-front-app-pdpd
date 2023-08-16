import React from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";

const CommissionPieChart = (props) => {
  const PieEChartColors = getChartColorsArray(props.dataColors);
  const options = {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      left: "left",
      data: ["Half Paid", "Full Paid", "Not Paid"],
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: PieEChartColors,
    series: [
      {
        name: "Total Students",
        type: "pie",
        radius: "65%",
        center: ["50%", "60%"],
        data: [
          { value: props.halfPaidCount, name: "Half Paid" },
          { value: props.fullPaidCount, name: "Full Paid" },
          { value: props.notPaidCount, name: "Not Paid" },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={options} />
    </React.Fragment>
  );
};
export default CommissionPieChart;
