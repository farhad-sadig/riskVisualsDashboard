import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface BusinessCategoriesState {
	businessCategories: string[];
	loading: boolean;
	error: string | null;
}

const initialState: BusinessCategoriesState = {
	businessCategories: [],
	loading: false,
	error: null
};

const businessCategoriesSlice = createSlice({
	name: "businessCategories",
	initialState,
	reducers: {
		setBusinessCategories: (state, action) => {
			state.businessCategories = action.payload;
		},
		setBusinessCategoriesLoading: (state, action) => {
			state.loading = action.payload;
		},
		setBusinessCategoriesError: (state, action) => {
			state.error = action.payload;
		}
	}
});

export const {
	setBusinessCategories,
	setBusinessCategoriesLoading,
	setBusinessCategoriesError
} = businessCategoriesSlice.actions;
export const selectBusinessCategories = (state: RootState) =>
	state.businessCategories.businessCategories;
export const selectBusinessCategoriesLoading = (state: RootState) =>
	state.businessCategories.loading;
export const selectBusinessCategoriesError = (state: RootState) =>
	state.businessCategories.error;

export default businessCategoriesSlice.reducer;
