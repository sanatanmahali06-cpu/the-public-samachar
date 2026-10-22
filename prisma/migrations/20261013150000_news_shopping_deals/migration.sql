CREATE TABLE "NewsProduct" (
    "newsId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "NewsProduct_pkey" PRIMARY KEY ("newsId", "productId")
);

CREATE UNIQUE INDEX "NewsProduct_newsId_position_key"
ON "NewsProduct"("newsId", "position");

ALTER TABLE "NewsProduct"
ADD CONSTRAINT "NewsProduct_newsId_fkey"
FOREIGN KEY ("newsId") REFERENCES "News"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "NewsProduct"
ADD CONSTRAINT "NewsProduct_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;