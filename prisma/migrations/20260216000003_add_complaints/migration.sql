-- Migration pour ajouter le système de gestion des plaintes

-- Créer les enum pour les plaintes
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE "ComplaintPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Créer la table Complaint
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "bookingId" TEXT,
    "userId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- Créer les index
CREATE INDEX "Complaint_hotelId_idx" ON "Complaint"("hotelId");
CREATE INDEX "Complaint_bookingId_idx" ON "Complaint"("bookingId");
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");
CREATE INDEX "Complaint_priority_idx" ON "Complaint"("priority");
CREATE INDEX "Complaint_createdAt_idx" ON "Complaint"("createdAt");

-- Ajouter les foreign keys
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

