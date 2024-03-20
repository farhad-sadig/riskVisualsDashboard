"use client";
import React, { useEffect, useState } from "react";
import {
	RadioGroup,
	Radio,
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem
} from "@nextui-org/react";
import { ChevronDownIcon } from "../table/ChevronDownIcon";
import { RiskDataItem } from "../table/Table";

import { fetchUniqueAssetNames, fetchUniqueBusCats } from "@/src/lib/data";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { selectAssetNames } from "@/src/lib/features/assetNamesSlice";
import { selectBusinessCategories } from "@/src/lib/features/businessCategoriesSlice";
import {
	filterDataByAssetNames,
	filterDataByBusCats
} from "@/src/lib/features/dataSlice";

type ChartControlDropdownProps = {
	selectedChartControl: string;
};
export type RadioButton = {
	key: keyof RiskDataItem;
	label: string;
};
type ControlItems = {
	busCats: string[];
	assetNames: string[];
};

const radioButtons: RadioButton[] = [
	{ key: "assetName", label: "Asset Name" },
	{ key: "businessCategory", label: "Business Category" }
];
export function ChartControlDropdown({
	selectedChartControl
}: ChartControlDropdownProps) {
	const [selectedKeys, setSelectedKeys] = useState<Set<keyof ControlItems>>(
		new Set([])
	);
	const assetNames = useAppSelector(selectAssetNames);
	const busCats = useAppSelector(selectBusinessCategories);
	const dispatch = useAppDispatch();
	const chartControlItems =
		selectedChartControl === radioButtons[0].label ? assetNames : busCats;

	useEffect(() => {
		setSelectedKeys(new Set([]));
	}, [selectedChartControl]);
	useEffect(() => {
		const keysArray = Array.from(selectedKeys);
		selectedChartControl === radioButtons[0].label
			? dispatch(filterDataByAssetNames(keysArray))
			: dispatch(filterDataByBusCats(keysArray));
	}, [dispatch, selectedKeys, selectedChartControl]);
	return (
		<Dropdown>
			<DropdownTrigger className="flex mt-4 md:mt-0">
				<Button
					className="bg-primary-700 text-slate-100 "
					endContent={<ChevronDownIcon className="text-small" />}
					variant="flat"
				>
					{selectedChartControl}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				variant="flat"
				closeOnSelect={false}
				aria-label="Chart Control Dropdown"
				selectionMode="multiple"
				selectedKeys={selectedKeys}
				onSelectionChange={(keys) =>
					setSelectedKeys(keys as Set<keyof ControlItems>)
				}
			>
				{chartControlItems.map((chartControlItem) => (
					<DropdownItem key={chartControlItem} className="capitalize">
						{chartControlItem}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}

export default function ChartControls() {
	const [selectedControl, setSelectedControl] = useState("");
	const [controlItems, setControlItems] = useState<ControlItems>({
		busCats: [],
		assetNames: []
	});

	useEffect(() => {
		const setChartControlDataOnServer = async () => {
			const busCats = await fetchUniqueBusCats();
			const assetNames = await fetchUniqueAssetNames();
			setControlItems({ busCats, assetNames });
		};
		setChartControlDataOnServer();
	}, []);

	return (
		<div className="flex text-slate-200">
			<RadioGroup
				className="modLight"
				label={`Plot Max Risk Ratings over Years for`}
				orientation="horizontal"
				value={selectedControl}
				onValueChange={setSelectedControl}
			>
				<Radio key={radioButtons[0].key} value={radioButtons[0].label}>
					{radioButtons[0].label}(s)
				</Radio>
				<Radio key={radioButtons[1].key} value={radioButtons[1].label}>
					{radioButtons[1].label}(ies)
				</Radio>
			</RadioGroup>
			<div className="mt-6 ml-4">
				{selectedControl && (
					<ChartControlDropdown selectedChartControl={selectedControl} />
				)}
			</div>
		</div>
	);
}
