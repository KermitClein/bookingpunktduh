-- Für GiST auf Ranges
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Verwende tsrange (ohne Zeitzone), weil Booking.startTs/endTs TIMESTAMP WITHOUT TIME ZONE sind
ALTER TABLE "Booking"
  ADD CONSTRAINT "no_overlap"
  EXCLUDE USING gist (
    "resourceId" WITH =,
    tsrange("startTs","endTs",'[]') WITH &&
  )
  WHERE ("status" = 'confirmed');
