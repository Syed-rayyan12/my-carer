CREATE TABLE "UploadedFile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "type" VARCHAR(80) NOT NULL,
  "purpose" VARCHAR(32) NOT NULL,
  "content" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UploadedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UploadedFile_userId_createdAt_idx" ON "UploadedFile"("userId", "createdAt");
ALTER TABLE "Verification" ADD COLUMN "uploadId" UUID;
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_uploadId_fkey"
  FOREIGN KEY ("uploadId") REFERENCES "UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Existing accounts may share a number. Preserve those records while preventing
-- every new claim of an already-used number, including concurrent requests.
CREATE FUNCTION normalise_uk_phone(value TEXT) RETURNS TEXT
LANGUAGE SQL IMMUTABLE PARALLEL SAFE AS $$
  SELECT CASE
    WHEN digits = '' THEN NULL
    WHEN digits LIKE '0044%' THEN '+' || substring(digits FROM 3)
    WHEN digits LIKE '44%' THEN '+' || digits
    WHEN digits LIKE '0%' THEN '+44' || substring(digits FROM 2)
    ELSE '+' || digits
  END FROM (SELECT regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g') AS digits) cleaned;
$$;
CREATE INDEX "CareSeekerProfile_normalised_phone_idx"
  ON "CareSeekerProfile" (normalise_uk_phone("phone"));

CREATE FUNCTION prevent_duplicate_account_phone() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE canonical TEXT;
BEGIN
  canonical := normalise_uk_phone(NEW."phone");
  IF canonical IS NULL THEN RETURN NEW; END IF;
  NEW."phone" := canonical;
  IF TG_OP = 'UPDATE' AND canonical IS NOT DISTINCT FROM normalise_uk_phone(OLD."phone") THEN
    RETURN NEW;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(canonical, 0));
  IF EXISTS (SELECT 1 FROM "CareSeekerProfile" p
    WHERE p."userId" <> NEW."userId" AND normalise_uk_phone(p."phone") = canonical) THEN
    RAISE EXCEPTION 'Phone number is already registered'
      USING ERRCODE = '23505', CONSTRAINT = 'CareSeekerProfile_phone_unique',
        TABLE = 'CareSeekerProfile', COLUMN = 'phone';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER "CareSeekerProfile_phone_unique"
  BEFORE INSERT OR UPDATE OF "phone" ON "CareSeekerProfile"
  FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_account_phone();
