-- Ensure bookingId has a unique index in Review table
-- This migration ensures the unique constraint exists even if it wasn't created in the initial migration

-- Create unique index if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "Review_bookingId_key" ON "Review"("bookingId");




