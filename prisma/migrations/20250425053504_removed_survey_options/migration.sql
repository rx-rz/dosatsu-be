/*
  Warnings:

  - You are about to drop the column `settings` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "settings",
ADD COLUMN     "requiresSignIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showLinkToSubmitAnother" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showProgressBar" BOOLEAN NOT NULL DEFAULT false;
