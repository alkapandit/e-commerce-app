-- CreateEnum
CREATE TYPE "SignatureType" AS ENUM ('DRAWN', 'TYPED');

-- AlterTable
ALTER TABLE "buyers" ALTER COLUMN "default_shipping_address_id" DROP NOT NULL,
ALTER COLUMN "wallet_balance" DROP NOT NULL,
ALTER COLUMN "preffered_payment_method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "signature_text" TEXT,
ADD COLUMN     "signature_type" "SignatureType",
ADD COLUMN     "signature_url" TEXT,
ADD COLUMN     "signed_at" TIMESTAMP(3),
ALTER COLUMN "strore_name" DROP NOT NULL,
ALTER COLUMN "gst_number" DROP NOT NULL,
ALTER COLUMN "pan_number" DROP NOT NULL,
ALTER COLUMN "bank_account_number" DROP NOT NULL,
ALTER COLUMN "bank_ifsc" DROP NOT NULL,
ALTER COLUMN "kyc_status" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "total_sales" DROP NOT NULL;
