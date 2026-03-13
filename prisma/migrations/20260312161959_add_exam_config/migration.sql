-- CreateTable
CREATE TABLE "exam_config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "examOpen" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_config_pkey" PRIMARY KEY ("id")
);
