
alter table "public"."decks" drop constraint "decks_company_handler_fkey";

alter table "public"."companies" drop constraint "companies_pkey";

alter table "public"."companies"
    add constraint "users_pkey"
    primary key ("handler");

alter table "public"."decks"
  add constraint "decks_user_handler_fkey"
  foreign key ("company_handler")
  references "public"."companies"
  ("handler") on update restrict on delete restrict;

alter table "public"."decks" rename column "company_handler" to "user_handler";

alter table "public"."companies" rename to "users";

alter table "public"."decks" rename column "status" to "state";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decks" add column "state" text
 null default 'processing';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decks" add column "pages_count" integer
 null;

alter table "public"."decks" alter column "original_pages_count" drop not null;
alter table "public"."decks" add column "original_pages_count" int4;

alter table "public"."decks" rename column "original_pages_count" to "original_pages";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decks" add column "original_pages" integer
 null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decks" add column "filename" text
 null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."slides" add column "original_page" integer
 null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."slides" add column "file_size" numeric
 null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."slides" add column "dimentions" text
 null;

DROP TABLE "public"."slides";

DROP TABLE "public"."decks";

DROP TABLE "public"."users";
