-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "visibleToPlayers" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "visibleToPlayers" BOOLEAN NOT NULL DEFAULT false;
