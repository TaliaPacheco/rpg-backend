/*
  Warnings:

  - You are about to drop the column `hp` on the `Character` table. All the data in the column will be lost.
  - Added the required column `hpCurrent` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hpMax` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "hp",
ADD COLUMN     "armorClass" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "hpCurrent" INTEGER NOT NULL,
ADD COLUMN     "hpMax" INTEGER NOT NULL,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "proficiencyBonus" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSpell" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "prepared" BOOLEAN NOT NULL DEFAULT false,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterSpell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InventoryItem_characterId_idx" ON "InventoryItem"("characterId");

-- CreateIndex
CREATE INDEX "CharacterSpell_characterId_idx" ON "CharacterSpell"("characterId");

-- CreateIndex
CREATE INDEX "Character_userId_idx" ON "Character"("userId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpell" ADD CONSTRAINT "CharacterSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
