-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "auctionEndsAt" TIMESTAMP(3),
ADD COLUMN     "startingPrice" DECIMAL(10,2);
