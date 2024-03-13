-- CreateTable
CREATE TABLE "RiskData" (
    "id" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "riskRating" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "RiskData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactor" (
    "id" TEXT NOT NULL,
    "riskFactor" TEXT NOT NULL,
    "subRiskRating" DOUBLE PRECISION NOT NULL,
    "riskDataId" TEXT NOT NULL,

    CONSTRAINT "RiskFactor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskFactor" ADD CONSTRAINT "RiskFactor_riskDataId_fkey" FOREIGN KEY ("riskDataId") REFERENCES "RiskData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
