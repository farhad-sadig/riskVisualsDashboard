import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface AssetNamesState {
	assetNames: string[];
	loading: boolean;
	error: string | null;
}

const initialState: AssetNamesState = {
	assetNames: [],
	loading: false,
	error: null
};

const assetNamesSlice = createSlice({
	name: "assetNames",
	initialState,
	reducers: {
		setAssetNames: (state, action) => {
			state.assetNames = action.payload;
		},
		setAssetNamesLoading: (state, action) => {
			state.loading = action.payload;
		},
		setAssetNamesError: (state, action) => {
			state.error = action.payload;
		}
	}
});

// Export actions and selectors
export const { setAssetNames, setAssetNamesLoading, setAssetNamesError } =
	assetNamesSlice.actions;
export const selectAssetNames = (state: RootState) =>
	state.assetNames.assetNames;
export const selectAssetNamesLoading = (state: RootState) =>
	state.assetNames.loading;
export const selectAssetNamesError = (state: RootState) =>
	state.assetNames.error;

// Export the reducer
export default assetNamesSlice.reducer;
