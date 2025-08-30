"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface VisitorsMapProps {
  visitorsData: { country: string; visitors: number }[];
}

export default function VisitorsMap({ visitorsData }: VisitorsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;

    const projection = d3
      .geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    svg.attr("width", width).attr("height", height);

    const visitorsMap = new Map(
      visitorsData.map((d) => [d.country.toLowerCase(), d.visitors])
    );

    const maxVisitors = d3.max(visitorsData, (d) => d.visitors) ?? 1;

    // Heatmap scale (light green → dark green)
    const colorScale = d3
      .scaleSequential(d3.interpolateGreens)
      .domain([0, maxVisitors]);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((worldData) => {
      // Use Topology type from topojson-client for correct typing
      const topology = worldData as Topology;
      const countriesFeatureCollection = feature(
        topology,
        topology.objects.countries
      ) as unknown as GeoJSON.FeatureCollection;
      const countries = countriesFeatureCollection.features;

      svg
        .selectAll("path")
        .data(countries)
        .enter()
        .append("path")
        .attr("d", (d) => path(d as GeoJSON.Feature) as string)
        .attr("fill", (d) => {
          const properties = (d as GeoJSON.Feature).properties as { name?: string } | null;
          const countryName = properties?.name ? properties.name.toLowerCase() : "";
          const visitors = visitorsMap.get(countryName) ?? 0;
          return colorScale(visitors);
        })
        .attr("stroke", "#333")
        .on("mouseover", function (event, d) {
          const properties = (d as GeoJSON.Feature).properties as { name?: string } | null;
          const countryName = properties?.name ?? "";
          const visitors = visitorsMap.get(countryName.toLowerCase()) ?? 0;

          d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");

          setTooltip({
            x: (event as MouseEvent).pageX,
            y: (event as MouseEvent).pageY,
            content: `${countryName}: ${visitors} visitors`,
          });
        })
        .on("mousemove", function (event) {
          setTooltip((prev) =>
            prev ? { ...prev, x: (event as MouseEvent).pageX, y: (event as MouseEvent).pageY } : null
          );
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 1).attr("stroke", "#333");
          setTooltip(null);
        });
    });
  }, [visitorsData]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="mx-auto my-6 shadow-lg rounded-lg"></svg>

      <TooltipProvider>
        {tooltip && (
          <Tooltip open>
            <TooltipTrigger asChild>
              <div
                style={{
                  position: "absolute",
                  left: tooltip.x,
                  top: tooltip.y,
                  width: "1px",
                  height: "1px",
                }}
              />
            </TooltipTrigger>
            <TooltipContent side="top">{tooltip.content}</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
