// Simple chart components for analytics visualization
// Using CSS and SVG for lightweight charts without external dependencies

import React from "react";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

// Line Chart Component
export function LineChart({
  data,
  title,
  width = 600,
  height = 300,
  color = "#059669",
  showGrid = true,
  showLabels = true,
}: {
  data: TimeSeriesPoint[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
}) {
  if (!data.length)
    return (
      <div className="text-gray-500 text-center py-8">No data available</div>
    );

  // Validate and filter data
  const validData = data.filter(
    (d) =>
      d &&
      typeof d.value === "number" &&
      !isNaN(d.value) &&
      isFinite(d.value) &&
      d.date
  );

  if (!validData.length) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No valid data available for chart</p>
      </div>
    );
  }

  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...validData.map((d) => d.value));
  const minValue = Math.min(...validData.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = validData.map((point, index) => {
    const x =
      validData.length > 1
        ? (index / (validData.length - 1)) * chartWidth
        : chartWidth / 2;
    const y =
      chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

    return {
      x: isFinite(x) ? x : 0,
      y: isFinite(y) ? y : chartHeight,
      ...point,
    };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <svg width={width} height={height} className="overflow-visible">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1={0}
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                  stroke="#6b7280"
                  strokeWidth={1}
                />
              ))}
              {points
                .filter((point) => isFinite(point.x))
                .map((point, index) => (
                  <line
                    key={index}
                    x1={point.x}
                    y1={0}
                    x2={point.x}
                    y2={chartHeight}
                    stroke="#6b7280"
                    strokeWidth={0.5}
                  />
                ))}
            </g>
          )}

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={2}
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {points
            .filter((point) => isFinite(point.x) && isFinite(point.y))
            .map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={color}
                className="drop-shadow-sm hover:opacity-80 transition-all cursor-pointer"
              />
            ))}

          {/* Y-axis labels */}
          {showLabels &&
            [0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <text
                key={ratio}
                x={-10}
                y={chartHeight * ratio + 5}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {(minValue + (1 - ratio) * valueRange).toFixed(0)}
              </text>
            ))}

          {/* X-axis labels */}
          {showLabels &&
            points
              .filter((point) => isFinite(point.x) && point.date)
              .map(
                (point, index) =>
                  index % Math.ceil(points.length / 6) === 0 && (
                    <text
                      key={index}
                      x={point.x}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {point.date ? point.date.slice(-2) : ""}
                    </text>
                  )
              )}
        </g>
      </svg>
    </div>
  );
}

// Bar Chart Component
export function BarChart({
  data,
  title,
  width = 600,
  height = 300,
  color = "#059669",
}: {
  data: ChartData[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!data.length)
    return (
      <div className="text-gray-500 text-center py-8">No data available</div>
    );

  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = (chartWidth / data.length) * 0.2;

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = index * (barWidth + barSpacing) + barSpacing / 2;
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color || color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                >
                  {item.value}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x =
              index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                transform={`rotate(-45, ${x}, ${chartHeight + 20})`}
              >
                {item.label}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// Pie Chart Component
export function PieChart({
  data,
  title,
  size = 300,
  showLabels = true,
  showPercentages = true,
}: {
  data: ChartData[];
  title?: string;
  size?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
}) {
  if (!data.length)
    return (
      <div className="text-gray-500 text-center py-8">No data available</div>
    );

  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    "#059669",
    "#0891b2",
    "#7c3aed",
    "#dc2626",
    "#ea580c",
    "#65a30d",
    "#ca8a04",
    "#be185d",
    "#4338ca",
    "#0d9488",
  ];

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    // Label position
    const labelAngle = (startAngle + endAngle) / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    const labelX = centerX + radius * 0.7 * Math.cos(labelAngleRad);
    const labelY = centerY + radius * 0.7 * Math.sin(labelAngleRad);

    currentAngle = endAngle;

    return {
      ...item,
      pathData,
      color: item.color || colors[index % colors.length],
      percentage: (item.value / total) * 100,
      labelX,
      labelY,
      sliceAngle,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <div className="flex items-center space-x-8">
        <svg width={size} height={size}>
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.pathData}
                fill={slice.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              {showPercentages && slice.sliceAngle > 20 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {slice.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        {showLabels && (
          <div className="space-y-2">
            {slices.map((slice, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-700">
                  {slice.label} ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Donut Chart Component
export function DonutChart({
  data,
  title,
  size = 300,
  centerText,
  showLabels = true,
}: {
  data: ChartData[];
  title?: string;
  size?: number;
  centerText?: string;
  showLabels?: boolean;
}) {
  if (!data.length)
    return (
      <div className="text-gray-500 text-center py-8">No data available</div>
    );

  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius * 0.6;
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colors = [
    "#059669",
    "#0891b2",
    "#7c3aed",
    "#dc2626",
    "#ea580c",
    "#65a30d",
    "#ca8a04",
    "#be185d",
    "#4338ca",
    "#0d9488",
  ];

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    currentAngle = endAngle;

    return {
      ...item,
      pathData,
      color: item.color || colors[index % colors.length],
      percentage: (item.value / total) * 100,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <div className="flex items-center space-x-8">
        <div className="relative">
          <svg width={size} height={size}>
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
            {centerText && (
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-semibold fill-gray-700"
              >
                {centerText}
              </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        {showLabels && (
          <div className="space-y-2">
            {slices.map((slice, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-700">
                  {slice.label} ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Area Chart Component
export function AreaChart({
  data,
  title,
  width = 600,
  height = 300,
  color = "#059669",
  fillOpacity = 0.3,
}: {
  data: TimeSeriesPoint[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
}) {
  if (!data.length)
    return (
      <div className="text-gray-500 text-center py-8">No data available</div>
    );

  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * chartWidth,
    y: chartHeight - ((point.value - minValue) / valueRange) * chartHeight,
    ...point,
  }));

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaData = `${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Area fill */}
          <path d={areaData} fill={color} opacity={fillOpacity} />

          {/* Line */}
          <path d={pathData} fill="none" stroke={color} strokeWidth={2} />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={3}
              fill={color}
              className="hover:opacity-80 transition-all cursor-pointer"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
