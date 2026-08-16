-- CreateTable
CREATE TABLE "ProductReminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductReminder_userId_idx" ON "ProductReminder"("userId");

-- CreateIndex
CREATE INDEX "ProductReminder_productId_idx" ON "ProductReminder"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReminder_userId_productId_key" ON "ProductReminder"("userId", "productId");

-- AddForeignKey
ALTER TABLE "ProductReminder" ADD CONSTRAINT "ProductReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReminder" ADD CONSTRAINT "ProductReminder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
