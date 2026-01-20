-- Add response and responseAt columns to Review table
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "response" TEXT;
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "responseAt" TIMESTAMP(3);

