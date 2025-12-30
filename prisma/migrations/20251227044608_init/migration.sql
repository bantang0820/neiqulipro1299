-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "childName" TEXT,
    "childAge" TEXT,
    "childGender" TEXT,
    "parentContact" TEXT,
    "answers" TEXT NOT NULL,
    "reportUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);
