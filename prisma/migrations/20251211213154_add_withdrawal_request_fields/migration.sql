/*
  Warnings:

  - Added the required column `accountName` to the `withdrawal_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `withdrawal_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `withdrawal_requests` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_withdrawal_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "transactionId" TEXT,
    "adminNotes" TEXT,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "withdrawal_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_withdrawal_requests" ("amount", "createdAt", "id", "status", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "status", "updatedAt", "userId" FROM "withdrawal_requests";
DROP TABLE "withdrawal_requests";
ALTER TABLE "new_withdrawal_requests" RENAME TO "withdrawal_requests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
