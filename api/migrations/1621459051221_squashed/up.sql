
CREATE TABLE "public"."companies" (
  "handler" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("handler"));

CREATE TABLE "public"."decks" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "company_handler" text NOT NULL,
  "title" text NOT NULL,
  "filename" text null,
  "pages_count" integer null,
  "status" text null default 'pending',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("company_handler") REFERENCES "public"."companies"("handler") ON UPDATE restrict ON DELETE restrict);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."slides" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "deck_id" uuid NOT NULL,
  "filename" text NOT NULL,
  "file_size" numeric null,
  "dimentions" text null,
  "priority" integer NOT NULL DEFAULT 0,
  "original_page" integer null,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id") ,
  FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON UPDATE restrict ON DELETE restrict);

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_slides_updated_at"
BEFORE UPDATE ON "public"."slides"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_slides_updated_at" ON "public"."slides"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

