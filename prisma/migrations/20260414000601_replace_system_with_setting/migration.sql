/*
  Warnings:

  - You are about to drop the column `system` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "system",
ADD COLUMN     "setting" TEXT;

-- DropEnum
DROP TYPE "SystemType";
