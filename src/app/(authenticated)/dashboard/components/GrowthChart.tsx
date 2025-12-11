"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { FaArrowTrendUp } from "react-icons/fa6";

type ChartData = {
  name: string;
  value: number;
};

interface GrowthChartProps {
  data: ChartData[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Calculate stats
  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );
  const growthPercentage = useMemo(() => {
    const lastMonth = data[data.length - 1]?.value || 0;
    const previousMonth = data[data.length - 2]?.value || 0;

    if (previousMonth > 0) {
      return ((lastMonth - previousMonth) / previousMonth) * 100;
    } else if (lastMonth > 0) {
      return 100;
    }
    return 0;
  }, [data]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setWidth(width);
      setHeight(height);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Scales
  const x = useMemo(() => {
    return d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.4);
  }, [data, width]);

  const y = useMemo(() => {
    const maxVal = d3.max(data, (d) => d.value) || 0;
    return d3
      .scaleLinear()
      .domain([0, Math.max(maxVal * 1.2, 5)]) // Ensure some height even with small values
      .range([height, 0]);
  }, [data, height]);

  // Gradient id
  const gradientId = "barGradient";

  return (
    <div className="card bg-base-100 shadow-sm h-full">
      <div className="card-body">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="card-title text-lg font-bold">
              Crecimiento de la Iglesia
            </h3>
            <p className="text-base-content/60 text-sm">
              Nuevos miembros registrados en el año en curso
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-success flex items-center justify-end gap-1">
              <FaArrowTrendUp />
              <span>
                {growthPercentage > 0 ? "+" : ""}
                {growthPercentage.toFixed(1)}% este mes
              </span>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="h-[300px] w-full relative">
          {width > 0 && height > 0 && (
            <svg width={width} height={height} className="overflow-visible">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {y.ticks(5).map((tickValue) => (
                <g key={tickValue} transform={`translate(0,${y(tickValue)})`}>
                  <line
                    x1={0}
                    x2={width}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                    strokeDasharray="3 3"
                  />
                </g>
              ))}

              {/* Bars */}
              {data.map((d, i) => {
                const barHeight = height - y(d.value);
                return (
                  <g key={i} className="group">
                    <rect
                      x={x(d.name)}
                      y={y(d.value)}
                      width={x.bandwidth()}
                      height={barHeight}
                      fill={`url(#${gradientId})`}
                      rx={6}
                      ry={6}
                      className="transition-all duration-300 group-hover:opacity-80"
                    />
                    {/* Hover Effect Overlay (optional) */}
                    <rect
                      x={x(d.name)}
                      y={y(d.value)}
                      width={x.bandwidth()}
                      height={barHeight}
                      fill="var(--color-primary)"
                      opacity={0}
                      rx={6}
                      ry={6}
                      className="transition-opacity duration-300 group-hover:opacity-20"
                    />

                    {/* X Axis Labels */}
                    <text
                      x={(x(d.name) || 0) + x.bandwidth() / 2}
                      y={height + 20}
                      textAnchor="middle"
                      fontSize={12}
                      fill="currentColor"
                      className="text-base-content/70 font-medium"
                    >
                      {d.name}
                    </text>

                    {/* Value Labels (on top) */}
                    <text
                      x={(x(d.name) || 0) + x.bandwidth() / 2}
                      y={y(d.value) - 8}
                      textAnchor="middle"
                      fontSize={12}
                      fill="currentColor"
                      className="font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {d.value}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
