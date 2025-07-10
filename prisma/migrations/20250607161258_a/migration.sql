/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `questions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `survey_id` on table `responses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "responses" ALTER COLUMN "survey_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "questions_id_key" ON "questions"("id");
