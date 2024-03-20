"use client";
import React, { useCallback, useState } from "react";
import * as d3 from "d3";
import {
	Table as Tbl,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Pagination,
	Tooltip
} from "@nextui-org/react";
import { sortBy } from "lodash";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { capitalize } from "./utils";
import { RiskData } from "@/src/lib/features/dataSlice";
import { useAppSelector } from "@/src/lib/hooks";
import { selectRiskDataByYear } from "@/src/lib/features/dataSlice";
import { RadioButton } from "../chartControls/ChartControls";

type SortDirection = "ascending" | "descending";

export type RiskDataItem = Pick<
	RiskData,
	"assetName" | "businessCategory" | "riskRating" | "riskFactors"
> & {
	key: string;
};

export type Column = RadioButton & {
	sortable?: boolean;
};
export const columns: Column[] = [
	{ key: "assetName", label: "Asset Name", sortable: true },
	{ key: "businessCategory", label: "Business Category", sortable: false },
	{ key: "riskRating", label: "Risk Rating", sortable: true }
];

const INITIAL_VISIBLE_COLUMNS: (keyof RiskDataItem)[] = [
	"assetName",
	"businessCategory",
	"riskRating"
];
const colorScaleLow = d3.interpolateRgb("#AAFF00", "#FFFF00");
const colorScaleMedium = d3.interpolateRgb("#FFFF00", "#dc2626");

const mapRiskRatingToColor = (rating: number): string => {
	if (rating <= 0.15) {
		return colorScaleLow(rating / 0.15);
	} else if (rating <= 0.5) {
		return colorScaleMedium((rating - 0.15) / (0.5 - 0.15));
	} else {
		return "#dc2626";
	}
};

const Table: React.FC = () => {
	const riskData: RiskData[] = useAppSelector(selectRiskDataByYear);

	const rows = riskData.map(
		(r) =>
			({
				key: r.id,
				assetName: r.assetName,
				businessCategory: r.businessCategory,
				riskFactors: r.riskFactors,
				riskRating: r.riskRating
			} as RiskDataItem)
	);

	const [filterValue, setFilterValue] = useState<string>("");
	const [visibleColumns, setVisibleColumns] = useState<Set<keyof RiskDataItem>>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [sortDescriptor, setSortDescriptor] = useState<{
		column: keyof RiskDataItem;
		direction: SortDirection;
	}>({
		column: "assetName",
		direction: "ascending"
	});
	const [page, setPage] = useState<number>(1);

	const headerColumns = columns.filter((column) =>
		visibleColumns.has(column.key)
	);

	const filteredItems = rows.filter((row) =>
		row.assetName.toLowerCase().includes(filterValue.toLowerCase())
	);

	const pages = Math.ceil(filteredItems.length / rowsPerPage);

	const items = filteredItems.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage
	);

	const sortedItems = sortBy(items, (item) => {
		const value = item[sortDescriptor.column];

		return sortDescriptor.direction === "descending" ? -value : value;
	});

	const renderCell = useCallback(
		(row: RiskDataItem, key: keyof RiskDataItem) => {
			const cellValue = row[key];
			switch (key) {
				case "assetName":
					return <>{row.assetName}</>;
				case "businessCategory":
					return <>{row.businessCategory}</>;
				case "riskRating":
					const riskFactors = row.riskFactors
						.filter((rF) => Math.round(rF.subRiskRating * 100) > 0)
						.map((rF) => (
							<div key={rF.riskFactor}>
								{rF.riskFactor}: {Math.round(rF.subRiskRating * 100)}%
							</div>
						));
					return (
						<Tooltip placement="left" content={riskFactors}>
							<Button
								style={{
									backgroundColor: `${mapRiskRatingToColor(row.riskRating)}`
								}}
								className={`text-left`}
							>
								{`${Math.round(row.riskRating * 100)}%`}
							</Button>
						</Tooltip>
					);
				default:
					return null;
			}
		},
		[]
	);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedValue = Number(e.target.value);

			setRowsPerPage(selectedValue);
			setPage(1);
		},
		[]
	);

	const onSearchChange = useCallback((value: React.SetStateAction<string>) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const topContent = (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between">
				<Input
					isClearable
					className="w-full sm:max-w-[44%]"
					placeholder="Search Asset Name"
					startContent={<SearchIcon />}
					value={filterValue}
					onClear={() => onClear()}
					onValueChange={onSearchChange}
				/>
				<div className="flex">
					<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button
								className="bg-primary-700 text-slate-100"
								endContent={<ChevronDownIcon className="text-small" />}
								variant="flat"
							>
								Columns
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							disallowEmptySelection
							aria-label="Table Columns"
							closeOnSelect={false}
							selectedKeys={visibleColumns}
							selectionMode="multiple"
							onSelectionChange={(keys) => {
								setVisibleColumns(keys as Set<keyof RiskDataItem>);
							}}
						>
							{columns.map((column) => (
								<DropdownItem key={column.key} className="capitalize">
									{capitalize(column.label)}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<div className="flex justify-between items-center">
				<span className="text-default-400 text-small">
					Total {rows.length} assets
				</span>
				<label className="flex items-center text-default-400 text-small">
					Rows per page:
					<select
						className="bg-transparent outline-none text-default-400 text-small"
						onChange={onRowsPerPageChange}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
					</select>
				</label>
			</div>
		</div>
	);

	const bottomContent = (
		<div className="py-2 px-2 flex flex-col justify-between items-center ">
			<Pagination
				isCompact
				showControls
				showShadow
				color="primary"
				page={page}
				total={pages}
				onChange={setPage}
			/>
			<div className="hidden sm:flex w-[30%] justify-center gap-2 my-2">
				<Button
					className="bg-primary-700 text-slate-100"
					isDisabled={pages === 1}
					size="sm"
					variant="flat"
					onPress={onPreviousPage}
				>
					Previous
				</Button>
				<Button
					className="bg-primary-700 text-slate-100"
					isDisabled={pages === 1}
					size="sm"
					variant="flat"
					onPress={onNextPage}
				>
					Next
				</Button>
			</div>
		</div>
	);

	return (
		<Tbl
			aria-label="Example table with custom cells, pagination and sorting"
			isHeaderSticky
			color="primary"
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			classNames={{
				wrapper: "h-[400px]"
			}}
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={(descriptor) => {
				if (descriptor.column) {
					setSortDescriptor({
						column: descriptor.column as keyof RiskDataItem,
						direction: descriptor.direction as SortDirection
					});
				}
			}}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.key}
						align={"start"}
						allowsSorting={column.sortable}
					>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={"No Assets Found"} items={sortedItems}>
				{(item) => (
					<TableRow key={item.key}>
						{(columnKey) => (
							<TableCell>
								{renderCell(item, columnKey as keyof RiskDataItem)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Tbl>
	);
};

export default Table;
