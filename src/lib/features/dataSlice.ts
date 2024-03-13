// dataSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { RiskData as PrismaRiskData } from "@prisma/client";
import { RootState } from "../store";

export interface RiskData extends PrismaRiskData {
	riskFactors: {
		subRiskRating: number;
		id: string;
		riskFactor: string;
		riskDataId: string;
	}[];
}
[];

interface DataState {
	riskData: RiskData[];
	riskDataByYear: RiskData[];
	riskDataByAssetsOrBusCats: RiskData[];
	loading: boolean;
	error: string | null;
}

const initialState: DataState = {
	riskData: [],
	riskDataByYear: [],
	riskDataByAssetsOrBusCats: [],
	loading: false,
	error: null
};

const dataSlice = createSlice({
	name: "data",
	initialState,
	reducers: {
		setRiskData: (state, action) => {
			state.riskData = action.payload;
		},
		filterDataByYear: (state, action) => {
			const selectedYear = action.payload;
			state.riskDataByYear = state.riskData.filter(
				(item) => item.year === selectedYear
			);
		},
		filterDataByAssetNames: (state, action) => {
			const selectedAssetNames = action.payload;
			state.riskDataByAssetsOrBusCats = state.riskData.filter((item) =>
				selectedAssetNames.includes(item.assetName)
			);
		},
		filterDataByBusCats: (state, action) => {
			const selectedBusCats = action.payload;
			state.riskDataByAssetsOrBusCats = state.riskData.filter((item) =>
				selectedBusCats.includes(item.businessCategory)
			);
		}
	}
});

// Export actions and selectors
export const {
	setRiskData,
	filterDataByYear,
	filterDataByAssetNames,
	filterDataByBusCats
} = dataSlice.actions;
export const selectRiskData = (state: RootState) => state.data.riskData;
export const selectRiskDataByYear = (state: RootState) =>
	state.data.riskDataByYear;
export const selectRiskDataByAssetsOrBusCats = (state: RootState) =>
	state.data.riskDataByAssetsOrBusCats;
export const selectLoading = (state: RootState) => state.data.loading;
export const selectError = (state: RootState) => state.data.error;

// Export the reducer
export default dataSlice.reducer;
