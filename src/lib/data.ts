"use server";
import { PrismaClient, RiskData as PrismaRiskData } from "@prisma/client";

export interface RiskData extends PrismaRiskData {
	riskFactors: {
		subRiskRating: number;
		id: string;
		riskFactor: string;
		riskDataId: string;
	}[];
}
[];
const prismaClientSingleton = () => {
	return new PrismaClient();
};
declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export const fetchRiskData = async (): Promise<RiskData[]> => {
	try {
		const riskData = await prisma.riskData.findMany({
			include: {
				riskFactors: {
					orderBy: {
						subRiskRating: "desc"
					}
				}
			},
			orderBy: {
				year: "asc"
			}
		});

		const formattedRiskData = riskData.map((data) => ({
			...data,
			riskFactors: data.riskFactors.map((factor) => ({
				...factor,
				subRiskRating: Number(factor.subRiskRating)
			}))
		}));
		console.log("fetched data from scratch");
		return formattedRiskData;
	} catch (error) {
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};

export const fetchUniqueYears = async (): Promise<number[]> => {
	try {
		const uniqueYears = await prisma.riskData.findMany({
			distinct: ["year"],
			orderBy: {
				year: "asc"
			}
		});

		return uniqueYears.map((entry) => entry.year);
	} finally {
		await prisma.$disconnect();
	}
};

export const fetchUniqueAssetNames = async (): Promise<string[]> => {
	try {
		const uniqueAssetNames = await prisma.riskData.findMany({
			distinct: ["assetName"],
			orderBy: {
				assetName: "asc"
			}
		});

		return uniqueAssetNames.map((entry) => entry.assetName);
	} finally {
		await prisma.$disconnect();
	}
};

export const fetchedUniqueBusCats = async (): Promise<string[]> => {
	try {
		const uniqueBusinessCategories = await prisma.riskData.findMany({
			distinct: ["businessCategory"],
			orderBy: {
				businessCategory: "asc"
			}
		});

		return uniqueBusinessCategories.map((entry) => entry.businessCategory);
	} finally {
		await prisma.$disconnect();
	}
};
