-- Migration pour ajouter le champ phone aux utilisateurs
-- Étape 1: Ajouter le champ comme nullable d'abord
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Note: Pour le rendre obligatoire plus tard, exécuter:
-- UPDATE "user" SET "phone" = '' WHERE "phone" IS NULL;
-- ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL;

