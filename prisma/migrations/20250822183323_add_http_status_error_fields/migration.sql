-- AlterTable
ALTER TABLE "public"."UptimeLog" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "httpStatus" INTEGER;
