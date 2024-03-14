import { PrismaClient } from "@prisma/client";
import { ParsedData } from "@/data/fetchParseData";
import fetchParseData from "@/data/fetchParseData";

const prisma = new PrismaClient();

const seedDataToDatabase = async () => {
	try {
		const parsedData: ParsedData[] = await fetchParseData();

		await prisma.$transaction(async (tx) => {
			const createPromises: Promise<void>[] = parsedData.map(async (obj) => {
				try {
					await prisma.riskData.create({
						data: {
							assetName: obj.assetName,
							lat: obj.lat,
							long: obj.long,
							businessCategory: obj.businessCategory,
							riskRating: obj.riskRating,
							year: obj.year,
							riskFactors: {
								create: obj.riskFactors.map((rf) => ({
									riskFactor: rf.riskFactor,
									subRiskRating: rf.subRiskRating
								}))
							}
						}
					});
				} catch (error: any) {
					console.error(`Error creating RiskData: ${error.message}`);
				}
			});

			await Promise.all(createPromises);
		});

		console.log("Database seeded successfully.");
	} catch (error) {
		console.error("Global error:", error);
	} finally {
		await prisma.$disconnect();
	}
};

seedDataToDatabase();
