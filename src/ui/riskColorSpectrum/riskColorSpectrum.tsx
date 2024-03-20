import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const RiskColorSpectrum = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);

	const initializeSVG = () => {
		if (!containerRef.current || !svgRef.current) return;

		const container = d3.select(containerRef.current);
		const svg = d3.select(svgRef.current);

		const boundingRect = container.node()!.getBoundingClientRect();
		const width = boundingRect.width;
		const height = boundingRect.height;

		svg.attr("width", width).attr("height", height);

		const margin = { top: 20, right: 20, bottom: 60, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		svg.selectAll("*").remove();

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const gradient = g
			.append("defs")
			.append("linearGradient")
			.attr("id", "riskGradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "0%");

		gradient.append("stop").attr("offset", "0%").attr("stop-color", "#AAFF00");
		gradient.append("stop").attr("offset", "15%").attr("stop-color", "#FFFF00");
		gradient.append("stop").attr("offset", "50%").attr("stop-color", "#dc2626");

		g.append("rect")
			.attr("width", innerWidth)
			.attr("height", innerHeight)
			.style("fill", "url(#riskGradient)");

		g.append("text")
			.attr("x", innerWidth / 2)
			.attr("y", innerHeight + margin.top + 20)
			.style("text-anchor", "middle")
			.text("Risk Rating Spectrum")
			.style("font-size", "14px")
			.attr("fill", "#f1f5f9");

		const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
		const xAxis = d3
			.axisBottom(xScale)
			.tickValues([0, 15, 50, 100])
			.tickFormat((d) => `${d}%`);

		g.append("g")
			.classed(`x-axis text-small text-slate-100`, true)
			.attr("transform", `translate(0,${innerHeight})`)
			.call(xAxis);
	};

	useEffect(() => {
		initializeSVG();
		const resizeObserver = new ResizeObserver(() => {
			initializeSVG();
		});
		const container = containerRef.current;
		if (container) {
			resizeObserver.observe(container);
		}
		return () => {
			if (container) {
				resizeObserver.unobserve(container);
			}
		};
	}, []);

	return (
		<div ref={containerRef} className="w-full h-full">
			<svg ref={svgRef}></svg>
		</div>
	);
};

export default RiskColorSpectrum;
