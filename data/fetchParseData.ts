import fs from "fs";
import csv from "csv-parser";
import filePath from "./filePath";

export interface RiskFactors {
	riskFactor: string;
	subRiskRating: number;
}
export interface ParsedData {
	assetName: string;
	lat: number;
	long: number;
	businessCategory: string;
	riskRating: number;
	riskFactors: RiskFactors[];
	year: number;
}

const transformHeader = (header: string) => {
	const tempHeader = header.replace(/\s/g, "");
	return tempHeader[0].toLocaleLowerCase() + tempHeader.slice(1);
};

export const riskFactorNames: RiskFactors[] = [];
const fetchParseData = () => {
	return new Promise<ParsedData[]>((resolve, reject) => {
		const dataArr: ParsedData[] = [];

		fs.createReadStream(filePath)
			.pipe(
				csv({
					mapHeaders: ({ header }) => transformHeader(header)
				})
			)
			.on("data", (row) => {
				const riskFactorsArr: RiskFactors[] = []; // Declare it inside the loop
				const parsedRiskFactors = JSON.parse(row.riskFactors);

				Object.entries(parsedRiskFactors).forEach(
					([riskFactor, subRiskRating]) => {
						riskFactorsArr.push({
							riskFactor,
							subRiskRating: parseFloat(subRiskRating as string)
						});
					}
				);

				const parsedRow: ParsedData = {
					assetName: row.assetName,
					lat: parseFloat(row.lat),
					long: parseFloat(row.long),
					businessCategory: row.businessCategory,
					riskRating: parseFloat(row.riskRating),
					riskFactors: riskFactorsArr,
					year: parseInt(row.year, 10)
				};

				dataArr.push(parsedRow);
			})
			.on("end", () => {
				console.log("CSV file successfully processed.");
				resolve(dataArr);
			})
			.on("error", (error) => {
				console.error("Error processing CSV file:", error);
				reject(error);
			});
	});
};

export default fetchParseData;
