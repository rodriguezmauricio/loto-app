-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "winningNumbers" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Result_modalidade_idx" ON "Result"("modalidade");
