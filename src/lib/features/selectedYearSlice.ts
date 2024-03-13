// selectedYearSlice.ts
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SelectedYearState {
	selectedYear: number | null;
	years: number[] | null;
}

const initialState: SelectedYearState = {
	selectedYear: null,
	years: null
};

const selectedYearSlice = createSlice({
	name: "selectedYear",
	initialState,
	reducers: {
		setSelectedYear: (state, action: PayloadAction<number | null>) => {
			state.selectedYear = action.payload;
		},
		setYears: (state, action: PayloadAction<number[]>) => {
			state.years = action.payload;
		}
	}
});

export const { setSelectedYear, setYears } = selectedYearSlice.actions;
export const selectSelectedYear = (state: RootState) =>
	state.selectedYear.selectedYear;
export const selectYears = (state: RootState) => state.selectedYear.years;
export const selectIsYearSelected = createSelector(
	selectSelectedYear,
	(selectedYear) => selectedYear !== null
);
export default selectedYearSlice.reducer;
