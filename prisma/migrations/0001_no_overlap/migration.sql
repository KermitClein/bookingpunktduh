-- Enable extension for exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT "no_overlap"
  EXCLUDE USING gist (
    "resourceId" WITH =,
    tstzrange("startTs","endTs",'[]') WITH &&
  )
  WHERE ("status" = 'confirmed');
