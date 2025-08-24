"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

export default function VisitorsMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800,
      height = 500;

    const projection = d3
      .geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);

    svg.attr("width", width).attr("height", height);

    // Load World Map GeoJSON
    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((worldData: any) => {
      const countriesFeatureCollection = feature(
        worldData,
        worldData.objects.countries
      ) as unknown as GeoJSON.FeatureCollection;
      const countries = countriesFeatureCollection.features;

      svg
        .selectAll("path")
        .data(countries)
        .enter()
        .append("path")
        .attr("d", (d: any) => path(d) as string)
        .attr("fill", "#69b3a2")
        .attr("stroke", "#333")
        .on("mouseover", function () {
          d3.select(this).attr("fill", "#ff7f0e");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#69b3a2");
        });
    });
  }, []);

  return <svg ref={svgRef} className="mx-auto my-6 shadow-lg rounded-lg"></svg>;
}
