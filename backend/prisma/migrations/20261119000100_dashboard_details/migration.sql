-- Preserve structured fields from the original dashboard forms.
ALTER TABLE "ProfessionalProfile" ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "CareRequest" ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Application" ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}';
