"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  getMemberGrowthStats,
  PeriodType,
} from "@/app/(authenticated)/dashboard/actions/dashboard.actions";
import { useDashboardStore } from "@/app/(authenticated)/dashboard/store/dashboardStore";

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

  const { growthChartPeriod, setGrowthChartPeriod } = useDashboardStore();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [mounted, setMounted] = useState(false);

  const [chartData, setChartData] = useState<ChartData[]>(data);
  const [dataPeriod, setDataPeriod] = useState<PeriodType>("month");
  const [loading, setLoading] = useState(false);

  // Sync with store on mount
  useEffect(() => {
    setMounted(true);
    setPeriod(growthChartPeriod);
  }, [growthChartPeriod]);

  // Fetch data when period changes (after mount)
  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      if (period === "month") {
        setChartData(data);
        setDataPeriod("month");
      } else {
        setLoading(true);
        try {
          const newData = await getMemberGrowthStats(period);
          setChartData(newData);
          setDataPeriod(period);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [period, mounted, data]);

  const handlePeriodChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPeriod = e.target.value as PeriodType;
    setPeriod(newPeriod);
    setGrowthChartPeriod(newPeriod);
  };

  // Calculate stats
  const total = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData]
  );
  const growthPercentage = useMemo(() => {
    const lastVal = chartData[chartData.length - 1]?.value || 0;
    const prevVal = chartData[chartData.length - 2]?.value || 0;

    if (prevVal > 0) {
      return ((lastVal - prevVal) / prevVal) * 100;
    } else if (lastVal > 0) {
      return 100;
    }
    return 0;
  }, [chartData]);

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
      .domain(chartData.map((d) => d.name))
      .range([0, width])
      .padding(0.4);
  }, [chartData, width]);

  const y = useMemo(() => {
    const maxVal = d3.max(chartData, (d) => d.value) || 0;
    return d3
      .scaleLinear()
      .domain([0, Math.max(maxVal * 1.2, 5)]) // Ensure some height even with small values
      .range([height, 0]);
  }, [chartData, height]);

  // Gradient id
  const gradientId = "barGradient";

  const getSubtitle = () => {
    switch (period) {
      case "year":
        return "Nuevos miembros en los últimos 5 años";
      case "quarter":
        return "Nuevos miembros por trimestre del año en curso";
      case "four-month":
        return "Nuevos miembros por cuatrimestre del año en curso";
      default:
        return "Nuevos miembros registrados en el año en curso";
    }
  };

  const getGrowthText = () => {
    switch (period) {
      case "year":
        return "este año";
      case "quarter":
        return "este trimestre";
      case "four-month":
        return "este cuatrimestre";
      default:
        return "este mes";
    }
  };

  const isDataMismatch = period !== dataPeriod;
  const showLoading = loading || isDataMismatch;

  return (
    <div className="card bg-base-100 shadow-sm h-full">
      <div className="card-body">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="card-title text-lg font-bold">
              Crecimiento de la Iglesia
            </h3>
            <p className="text-base-content/60 text-sm">{getSubtitle()}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <select
              className="select select-sm select-bordered w-full max-w-xs"
              value={period}
              onChange={handlePeriodChange}
              disabled={showLoading}
            >
              <option value="month">Mensual</option>
              <option value="quarter">Trimestral</option>
              <option value="four-month">Cuatrimestral</option>
              <option value="year">Anual</option>
            </select>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {showLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  total
                )}
              </div>
              {!showLoading && (
                <div className="text-xs text-success flex items-center justify-end gap-1">
                  <FaArrowTrendUp />
                  <span>
                    {growthPercentage > 0 ? "+" : ""}
                    {growthPercentage.toFixed(1)}% {getGrowthText()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={containerRef} className="h-[300px] w-full relative">
          {showLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 z-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
          {width > 0 && height > 0 && !showLoading && (
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
              {chartData.map((d, i) => {
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
