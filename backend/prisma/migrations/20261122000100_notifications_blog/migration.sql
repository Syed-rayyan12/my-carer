CREATE TABLE "NotificationState" (
  "userId" UUID NOT NULL,
  "eventId" VARCHAR(200) NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "dismissed" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "NotificationState_pkey" PRIMARY KEY ("userId", "eventId"),
  CONSTRAINT "NotificationState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "BlogPost" (
  "id" VARCHAR(100) PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "description" VARCHAR(1000) NOT NULL,
  "content" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "author" VARCHAR(160) NOT NULL,
  "date" VARCHAR(40) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'Draft',
  "image" TEXT NOT NULL DEFAULT '',
  "seoTitle" VARCHAR(200) NOT NULL DEFAULT '',
  "metaDescription" VARCHAR(1000) NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "BlogPost_status_createdAt_idx" ON "BlogPost"("status", "createdAt");
