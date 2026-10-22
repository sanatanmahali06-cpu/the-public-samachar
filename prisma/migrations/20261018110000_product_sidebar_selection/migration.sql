ALTER TABLE "Product"
ADD COLUMN "showInShoppingDeals" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Product"
ADD COLUMN "showInBestDeals" BOOLEAN NOT NULL DEFAULT false;

WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (ORDER BY "createdAt" DESC, "id" DESC) AS rn,
    COUNT(*) OVER () AS total
  FROM "Product"
)
UPDATE "Product" AS p
SET
  "showInShoppingDeals" = ranked.rn <= CEIL(ranked.total / 2.0),
  "showInBestDeals" = ranked.rn > CEIL(ranked.total / 2.0)
FROM ranked
WHERE p."id" = ranked."id";