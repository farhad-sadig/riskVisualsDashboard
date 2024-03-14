"use client";
import {
	fetchRiskData,
	fetchUniqueAssetNames,
	fetchUniqueYears,
	fetchedUniqueBusCats
} from "@/src/lib/data";
import { setRiskData } from "@/src/lib/features/dataSlice";
import { setYears } from "@/src/lib/features/selectedYearSlice";
import { useAppDispatch } from "@/src/lib/hooks";
import LineChart from "@/src/ui/chart/LineChart";
import Map from "@/src/ui/map/Map";

import Table from "@/src/ui/table/Table";
import YearSelect from "@/src/ui/yearSelect/yearSelect";
import { useEffect, useState } from "react";
import { setAssetNames } from "@/src/lib/features/assetNamesSlice";
import { setBusinessCategories } from "@/src/lib/features/businessCategoriesSlice";
import Spinner from "@/src/ui/Spinner";

export default function DashboardPage() {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState<Boolean>(true);
	useEffect(() => {
		const initializeData = async () => {
			try {
				const [riskData, years, assetNames, busCats] = await Promise.all([
					fetchRiskData(),
					fetchUniqueYears(),
					fetchUniqueAssetNames(),
					fetchedUniqueBusCats()
				]);

				dispatch(setRiskData(riskData));
				dispatch(setYears(years));
				dispatch(setAssetNames(assetNames));
				dispatch(setBusinessCategories(busCats));
			} catch (error) {
				console.error(`Error details: `, error);
				throw new Error(`Error initializing data`);
			} finally {
				setLoading(false);
			}
		};

		initializeData();
	}, [dispatch]);
	if (loading) return <Spinner />;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
			<div className="min-h-[300px] md:col-span-2 p-4 my-4 md:mt-0 ">
				<LineChart />
			</div>
			<div className="col-span-1 md:col-span-2  p-4 mt-4 md:my-0">
				<YearSelect />
			</div>

			<div className="min-h-[300px] col-span-1 md:col-span-1 p-4 my-4 md:my-0">
				<Map />
			</div>

			<div className="col-span-1 md:col-span-1 p-4 my-4 md:my-0">
				<Table />
			</div>
		</div>
	);
}
