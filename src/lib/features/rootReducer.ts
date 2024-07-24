import { combineReducers } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice";
import selectedYearReducer from "./selectedYearSlice";
import assetNamesReducer from "./assetNamesSlice";
import businessCategoriesReducer from "./businessCategoriesSlice";

const rootReducer = combineReducers({
	data: dataReducer,
	selectedYear: selectedYearReducer,
	assetNames: assetNamesReducer,
	businessCategories: businessCategoriesReducer
});

export default rootReducer;
