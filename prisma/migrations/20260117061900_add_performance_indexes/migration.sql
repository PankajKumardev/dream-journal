-- CreateIndex
CREATE INDEX "Dream_userId_recordedAt_idx" ON "Dream"("userId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "Dream_embeddingStatus_idx" ON "Dream"("embeddingStatus");

-- CreateIndex
CREATE INDEX "DreamAnalysis_analysisStatus_idx" ON "DreamAnalysis"("analysisStatus");
