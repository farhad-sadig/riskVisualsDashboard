import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import {
	selectYears,
	setSelectedYear
} from "@/src/lib/features/selectedYearSlice";
import { filterDataByYear } from "@/src/lib/features/dataSlice";

const YearSelect = () => {
	const dispatch = useAppDispatch();
	const allYears = useAppSelector(selectYears);
	const selectedYear = useAppSelector(
		(state) => state.selectedYear.selectedYear
	);
	const [value, setValue] = useState<string>(
		selectedYear ? selectedYear.toString() : ""
	);
	const handleSelectionChange = (e: { target: { value: string } }) => {
		const selectedYear = parseInt(e.target.value, 10);
		setValue(e.target.value);
		dispatch(setSelectedYear(selectedYear));
	};

	useEffect(() => {
		if (allYears) {
			dispatch(filterDataByYear(selectedYear));
		}
	}, [dispatch, selectedYear, allYears]);

	if (!allYears) {
		return <div>No Years Were Loaded</div>;
	}

	if (allYears.length === 0) {
		return <div>No Years Available</div>;
	}

	return (
		<div className="flex w-full max-w-xs flex-col gap-2 mt-16 md:mt-4 text-slate-200">
			<div>Filter Map and Table By Year</div>
			<Select
				variant="bordered"
				placeholder="Select a year"
				onChange={handleSelectionChange}
				value={value}
				aria-label="Select a year to filter risk data by"
			>
				{allYears.map((year) => (
					<SelectItem key={year} textValue={year.toString()}>
						{year}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export default YearSelect;
