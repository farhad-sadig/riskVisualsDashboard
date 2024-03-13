"use client";
import { selectRiskDataByAssetsOrBusCats } from "@/src/lib/features/dataSlice";
import { useAppSelector } from "@/src/lib/hooks";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { RootState } from "@/src/lib/store";
import { RiskData } from "@prisma/client";
import ChartControls from "../chartControls/ChartControls";

const xAccessor = (d: RiskData) => d.year;
const yAccessor = (d: RiskData) => d.riskRating;

const margin = {
	top: 50,
	right: 50,
	bottom: 50,
	left: 75
};

const LineChart = () => {
	const svgRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const riskData = useAppSelector((state: RootState) =>
		selectRiskDataByAssetsOrBusCats(state)
	);

	useEffect(() => {
		function updateChart() {
			if (!svgRef.current) {
				return;
			}
			const currentSVGRef = svgRef.current;
			if (!riskData || riskData.length) {
				currentSVGRef.textContent = "Couldn't fetch the data";
				return;
			}

			const rect = svgRef.current.getBoundingClientRect();
			const dimensions = { width: rect.width, height: rect.height };

			const svg = d3.select(currentSVGRef).select<SVGSVGElement>("svg").empty()
				? d3.select(currentSVGRef).append<SVGSVGElement>("svg")
				: d3.select(currentSVGRef).select<SVGSVGElement>("svg");

			svg.attr("width", dimensions.width).attr("height", dimensions.height);

			svg.selectAll("circle").remove();
			svg.selectAll("rect").remove();

			const ctr = svg.select<SVGSVGElement>("g").empty()
				? svg.append<SVGSVGElement>("g")
				: svg.select<SVGSVGElement>("g");

			ctr.attr("transform", `translate(${margin.left}, ${margin.top})`);

			const ctrWidth = dimensions.width - margin.left - margin.right;
			const ctrHeight = dimensions.height - margin.top - margin.bottom;

			const dataByX = d3.group(riskData, xAccessor);
			const maxYByX = Array.from(dataByX).map(([xValue, group]) => {
				return {
					x: xValue,
					y: d3.max(group, yAccessor)!,
					assetName: group[0].assetName
				};
			});

			const minXValue = d3.min(maxYByX, (d) => d.x);
			const maxXValue = d3.max(maxYByX, (d) => d.x);
			const minYValue = d3.min(maxYByX, (d) => d.y);
			const maxYValue = d3.max(maxYByX, (d) => d.y);

			const xScale = d3
				.scaleLinear()
				.domain([minXValue!, maxXValue!])
				.range([0, ctrWidth]);

			const yScale = d3
				.scaleLinear()
				.domain([minYValue!, maxYValue!])
				.rangeRound([ctrHeight, 0]);

			const lineGenerator = d3
				.line<{ x: number; y: number }>()
				.x((d) => xScale(d.x))
				.y((d) => yScale(d.y));

			const xAxis = d3.axisBottom(xScale).ticks(5);

			const existingXAxis = ctr.select(".x-axis");

			if (existingXAxis.empty()) {
				ctr.append("g").classed(`x-axis axis text-small text-slate-100`, true);
				ctr
					.select(".x-axis")
					.append("text")
					.attr("fill", "#f1f5f9")
					.text("Year")
					.style("text-anchor", "middle");
			}
			ctr.select(".x-axis").style("transform", `translateY(${ctrHeight}px)`);

			ctr
				.select(".x-axis text")
				.attr("x", ctrWidth / 2)
				.attr("y", margin.bottom - 3);

			existingXAxis
				.transition()
				.duration(2000)
				.call(xAxis as any);

			const yAxis = d3
				.axisLeft(yScale)
				.ticks(5)
				.tickFormat((t) => t.valueOf() * 100 + "%");

			const existingYAxis = ctr.select(".y-axis");

			if (existingYAxis.empty()) {
				ctr.append("g").classed("y-axis axis text-small text-slate-100", true);
				ctr
					.select(".y-axis")
					.append("text")
					.attr("fill", "#f1f5f9")
					.text("Risk Rating")
					.style("transform", "rotate(270deg)")
					.style("text-anchor", "middle");
			}

			ctr
				.select(".y-axis text")
				.attr("x", -ctrHeight / 2)
				.attr("y", -margin.left + 10);

			existingYAxis
				.transition()
				.duration(2000)
				.call(yAxis as any);

			const tooltipDot = ctr
				.append("circle")
				.attr("r", 5)
				.attr("fill", "#fc8781")
				.attr("stroke", "black")
				.attr("stroke-width", 2)
				.style("opacity", 0)
				.style("pointer-events", "none");

			ctr
				.append("rect")
				.style("opacity", 0)
				.attr("width", ctrWidth)
				.attr("height", ctrHeight)

				.on("touchmove mousemove", function (event) {
					const mousePos = d3.pointer(event, this);
					const year = xScale.invert(mousePos[0]);
					const riskRatingBisect = d3.bisector(
						(d: { x: number; y: number }) => d.x
					).left;
					const index = riskRatingBisect(maxYByX, year);
					const closestRiskRating =
						mousePos[0] / ctrWidth < 0.9 ? maxYByX[index - 1] : maxYByX[index];

					if (closestRiskRating) {
						tooltipDot
							.style("display", "block")
							.style("opacity", 1)
							.attr("cx", xScale(closestRiskRating.x))
							.attr("cy", yScale(closestRiskRating.y))
							.raise();

						const rectPos = currentSVGRef.getBoundingClientRect();

						const tooltipX = rectPos.left + xScale(closestRiskRating.x);
						const tooltipY = rectPos.top + yScale(closestRiskRating.y);

						d3.select(tooltipRef.current)
							.style("display", "block")
							.style("top", `${tooltipY + 75}px`)
							.style("left", `${tooltipX + 50}px`);

						d3.select(tooltipRef.current)
							.select(".asset-name")
							.text(closestRiskRating.assetName);

						d3.select(tooltipRef.current)
							.select(".year")
							.text(closestRiskRating.x);

						d3.select(tooltipRef.current)
							.select(".risk-rating")
							.text(`${Math.round(closestRiskRating.y * 100)}%`);
						console.log(closestRiskRating.y);
					}
				})
				.on("mouseleave", function (event) {
					tooltipDot.style("opacity", 0);
					d3.select(tooltipRef.current).style("display", "none");
				});

			const line = ctr
				.selectAll<
					SVGPathElement,
					{ x: number; y: number; assetName: string }[]
				>(".lineTest")
				.data([maxYByX]);

			line
				.enter()
				.append("path")
				.classed("lineTest", true)
				.merge(line)
				.transition()
				.duration(2000)
				.attr("d", (d) => lineGenerator(d))
				.attr("fill", "none")
				.attr("stroke", "#fde68a")
				.attr("stroke-width", 2);
		}

		updateChart();

		const resizeObserver = new ResizeObserver(() => {
			updateChart();
		});

		if (svgRef.current) {
			resizeObserver.observe(svgRef.current);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [riskData]);

	return (
		<>
			<ChartControls />

			<div ref={svgRef} className="w-full h-full"></div>
			<div id="tooltip" ref={tooltipRef} className="text-tiny">
				<div className="asset-name font-bold"></div>
				<div className="year"></div>
				<div className="risk-rating"></div>
			</div>
		</>
	);
};

export default LineChart;
