-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "role" SET DEFAULT 'BUYER';
