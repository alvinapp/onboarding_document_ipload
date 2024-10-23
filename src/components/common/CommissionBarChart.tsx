import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Card } from './Card';

// Define data structure for the chart
interface DataItem {
  organization: string;
  sales: number;
  commission: number;
}

// Define props for the component
interface AmChart3DClusteredBarChartProps {
  data: DataItem[];
  title?: string;
}

const AmChart3DClusteredBarChart: React.FC<AmChart3DClusteredBarChartProps> = ({
  data,
  title = 'Sales vs Commission by Organization',
}) => {
  const chartRef = useRef<HTMLDivElement>(null); // Reference for the chart container

  useLayoutEffect(() => {
    if (!chartRef.current) return; // Ensure chart ref is ready

    // Create root element
    const root = am5.Root.new(chartRef.current);

    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create XYChart instance
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    // Create Y-axis (Category Axis)
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'organization',
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 20, // Adjusts space between categories
          inversed: true, // Inverse to show top-down
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
      })
    );
    yAxis.data.setAll(data);

    // Create X-axis (Value Axis)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          opposite: true, // Values appear on the right
        }),
      })
    );

    // Helper function to create series for sales and commission
    const createSeries = (field: keyof DataItem, name: string, color: string) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: 'organization',
          clustered: true, // Clustering to compare sales and commission
        })
      );

      // Set style for columns
      series.columns.template.setAll({
        tooltipText: `[bold]{name}[/] for {organization}: {valueX}`,
        width: am5.percent(90),
        fill: am5.color(color),
        stroke: am5.color(color),
        cornerRadiusTR: 5,
        cornerRadiusBR: 5,
      });

      // Add value label to each column
    //   series.bullets.push(() =>
    //     am5.Bullet.new(root, {
    //       locationX: 1,
    //       sprite: am5.Label.new(root, {
    //         // Update to use a function that returns the actual value
    //         text: '{valueX}', // This will still work as intended
    //         fill: am5.color(0x000000),
    //         centerX: am5.percent(50),
    //         centerY: am5.percent(50),
    //       }),
    //     })
    //   );

      series.data.setAll(data);
    };

    // Create the two series (sales and commission)
    createSeries('sales', 'Sales', '#34a853'); // Green for sales
    createSeries('commission', 'Commission', '#4285f4'); // Blue for commission

    // Add a legend
    chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout,
      })
    );

    // Add chart title
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

    // Animation for series
    chart.series.each((series) => {
      series.appear(1000);
    });

    // Dispose of chart on cleanup
    return () => {
      root.dispose();
    };
  }, [data, title]);

  return <Card><div ref={chartRef} style={{ width: '100%', height: '300px' }} /></Card>;
};

export default AmChart3DClusteredBarChart;
