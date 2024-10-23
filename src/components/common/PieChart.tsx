import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Card } from './Card';

// Define the structure of each data point
interface DataItem {
  category: string;
  value: number;
}

// Define the props for the chart component
interface AmChart3DPieChartProps {
  data: DataItem[];
  title?: string;
  innerRadius?: number;
  depth?: number;
}

const AmChart3DPieChart: React.FC<AmChart3DPieChartProps> = ({
  data,
  title = '3D Pie Chart',
  innerRadius = 50,
  depth = 15, // Adjust depth for a subtle 3D effect
}) => {
  const chartRef = useRef<HTMLDivElement>(null); // Reference for chart container

  useLayoutEffect(() => {
    if (!chartRef.current) return; // Prevents errors if the ref is not yet assigned

    // Initialize the root element
    const root = am5.Root.new(chartRef.current);

    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create PieChart with 3D effect
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(innerRadius), // Set inner radius
      })
    );

    // Create a 3D pie series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
      })
    );

    // Add the chart data
    series.data.setAll(data);

    // Customize the slice appearance
    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      cornerRadius: 5,
      tooltipText: '{category}: {value}', // Tooltip
    });

    // Add chart title (optional)
    chart.children.unshift(
      am5.Label.new(root, {
        text: title,
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 10,
        paddingBottom: 20,
      })
    );

    // Add legend
    // const legend = chart.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.percent(50),
    //     x: am5.percent(50),
    //     layout: root.horizontalLayout,
    //   })
    // );
    // legend.data.setAll(series.dataItems);

    // Animate chart appearance
    series.appear(1000, 100);

    // Cleanup function to dispose of the chart when the component is unmounted
    return () => {
      root.dispose();
    };
  }, [data, innerRadius, depth]);

  return (
    <Card><div
      ref={chartRef}
      style={{ width: '100%', height: '300px', margin: '0 auto' }}
    /></Card>
  );
};

export default AmChart3DPieChart;
