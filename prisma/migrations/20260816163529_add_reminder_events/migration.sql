-- CreateEnum
CREATE TYPE "ReminderEventKind" AS ENUM ('BEFORE_START', 'AT_START');

-- CreateTable
CREATE TABLE "ReminderEvent" (
    "id" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "kind" "ReminderEventKind" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "ReminderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReminderEvent_reminderId_kind_key" ON "ReminderEvent"("reminderId", "kind");

-- CreateIndex
CREATE INDEX "ReminderEvent_sentAt_scheduledAt_idx" ON "ReminderEvent"("sentAt", "scheduledAt");

-- AddForeignKey
ALTER TABLE "ReminderEvent" ADD CONSTRAINT "ReminderEvent_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "ProductReminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;