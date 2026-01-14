-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "transcript" TEXT NOT NULL,
    "embedding" vector(1024),
    "embeddingStatus" TEXT NOT NULL DEFAULT 'pending',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moodBefore" INTEGER,
    "stressLevel" INTEGER,
    "sleepQuality" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamAnalysis" (
    "id" TEXT NOT NULL,
    "dreamId" TEXT NOT NULL,
    "analysisStatus" TEXT NOT NULL DEFAULT 'pending',
    "themes" JSONB NOT NULL DEFAULT '[]',
    "emotions" JSONB NOT NULL DEFAULT '{}',
    "symbols" JSONB NOT NULL DEFAULT '[]',
    "people" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB NOT NULL DEFAULT '[]',
    "isNightmare" BOOLEAN NOT NULL DEFAULT false,
    "isLucid" BOOLEAN NOT NULL DEFAULT false,
    "vividness" INTEGER NOT NULL DEFAULT 5,
    "summary" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DreamAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternType" TEXT NOT NULL,
    "patternData" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "occurrenceCount" INTEGER NOT NULL,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Dream_userId_idx" ON "Dream"("userId");

-- CreateIndex
CREATE INDEX "Dream_recordedAt_idx" ON "Dream"("recordedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DreamAnalysis_dreamId_key" ON "DreamAnalysis"("dreamId");

-- CreateIndex
CREATE INDEX "Pattern_userId_patternType_idx" ON "Pattern"("userId", "patternType");

-- CreateIndex
CREATE INDEX "WeeklyReport_userId_weekStart_idx" ON "WeeklyReport"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_userId_weekStart_key" ON "WeeklyReport"("userId", "weekStart");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamAnalysis" ADD CONSTRAINT "DreamAnalysis_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
