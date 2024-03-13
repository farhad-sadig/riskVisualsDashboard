import { useEffect, useRef, useState } from "react";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";

import { RiskData } from "@prisma/client";
import {
	filterDataByAssetNames,
	selectRiskDataByYear
} from "@/src/lib/features/dataSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import "mapbox-gl/dist/mapbox-gl.css";

interface GeoJSONFeature {
	type: "Feature";
	geometry: {
		type: "Point";
		coordinates: [number, number];
	};
	properties: {
		description: string;
		riskRating: number;
		assetName: string;
	};
}

interface GeoJSONCollection {
	type: "FeatureCollection";
	features: GeoJSONFeature[];
}

export interface MapProps {
	riskData: RiskData[];
}

const createGeoJSONFromRiskData = (riskData: RiskData[]): GeoJSONCollection => {
	return {
		type: "FeatureCollection",
		features: riskData.map((risk) => ({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [risk.long, risk.lat]
			},
			properties: {
				description: `<strong>${risk.assetName}</strong><p>${
					risk.businessCategory
				}</p><p>${Math.round(risk.riskRating * 100)}%</p>`,
				riskRating: risk.riskRating,
				assetName: risk.assetName
			}
		}))
	};
};

if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
	mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

const Map = () => {
	const mapData = useAppSelector(selectRiskDataByYear);
	const [error, setError] = useState<string | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const popupRef = useRef<mapboxgl.Popup | null>(null);
	const lngRef = useRef(-74);
	const latRef = useRef(45);
	const zoomRef = useRef(4.5);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const renderMap = () => {
			try {
				if (!mapContainerRef.current) return;
				if (!mapRef.current) {
					mapRef.current = new mapboxgl.Map({
						container: mapContainerRef.current,
						style: "mapbox://styles/mapbox/streets-v12",
						center: [lngRef.current, latRef.current],
						zoom: zoomRef.current
					});

					mapRef.current.on("load", () => {
						mapRef.current!.addSource("places", {
							type: "geojson",
							data: createGeoJSONFromRiskData(mapData)
						});

						mapRef.current!.addLayer({
							id: "places",
							type: "circle",
							source: "places",
							paint: {
								"circle-color": [
									"interpolate",
									["linear"],
									["get", "riskRating"],
									0,
									"#AAFF00",
									0.15,
									"#FFFF00",
									0.5,
									"#dc2626"
								],
								"circle-radius": 8,
								"circle-stroke-width": 3,
								"circle-stroke-color": "#ffffff"
							}
						});
					});

					mapRef.current.on("move", () => {
						lngRef.current = mapRef.current!.getCenter().lng;
						latRef.current = mapRef.current!.getCenter().lat;
						zoomRef.current = mapRef.current!.getZoom();
					});

					mapRef.current.on("click", "places", (e) => {
						if (e.features && e.features.length > 0) {
							const feature = e.features[0] as MapboxGeoJSONFeature;

							if (feature.geometry.type === "Point") {
								dispatch(
									filterDataByAssetNames([feature.properties?.assetName])
								);
							}
						}
					});

					mapRef.current.on("mouseenter", "places", (e) => {
						mapRef.current!.getCanvas().style.cursor = "pointer";

						if (e.features && e.features.length > 0) {
							const feature = e.features[0] as MapboxGeoJSONFeature;

							if (feature.geometry.type === "Point") {
								const coordinates = feature.geometry?.coordinates.slice() as [
									number,
									number
								];
								const description = feature.properties?.description;

								popupRef.current = new mapboxgl.Popup({
									closeButton: false,
									closeOnClick: false
								})
									.setLngLat(coordinates)
									.setHTML(description)
									.addTo(mapRef.current!);
							}
						}
					});

					mapRef.current.on("mouseleave", "places", () => {
						mapRef.current!.getCanvas().style.cursor = "";
						if (popupRef.current) {
							popupRef.current.remove();
							popupRef.current = null;
						}
					});

					const resizeObserver = new ResizeObserver(() => {
						mapRef.current!.resize();
					});
					resizeObserver.observe(mapContainerRef.current!);

					return () => {
						resizeObserver.disconnect();
						mapRef.current!.remove();
						if (popupRef.current) {
							popupRef.current.remove();
							popupRef.current = null;
						}
					};
				} else {
					const source = mapRef.current.getSource("places");
					if (source && source.type === "geojson") {
						(source as mapboxgl.GeoJSONSource).setData(
							createGeoJSONFromRiskData(mapData)
						);
					}
				}
			} catch (error) {
				setError("Error initializing the map");
				console.error("Map initialization error:", error);
			}
		};

		renderMap();
	}, [mapData, dispatch]);

	if (error) {
		return (
			<div role="alert" className="text-red-500 font-bold">
				{error}
			</div>
		);
	}

	return <div className="rounded-large w-full h-full" ref={mapContainerRef} />;
};

export default Map;
