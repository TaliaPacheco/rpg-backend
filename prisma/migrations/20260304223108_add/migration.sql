/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `CampaignParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CampaignParticipant" DROP COLUMN "joinedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
