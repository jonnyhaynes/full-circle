import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "about_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "services_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "backstage_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "backstage_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "seo_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP COLUMN "seo_title";
  ALTER TABLE "home_page" DROP COLUMN "seo_description";
  ALTER TABLE "about_page" DROP COLUMN "seo_title";
  ALTER TABLE "about_page" DROP COLUMN "seo_description";
  ALTER TABLE "services_page" DROP COLUMN "seo_title";
  ALTER TABLE "services_page" DROP COLUMN "seo_description";
  ALTER TABLE "backstage_page" DROP COLUMN "seo_title";
  ALTER TABLE "backstage_page" DROP COLUMN "seo_description";
  ALTER TABLE "contact_page" DROP COLUMN "seo_title";
  ALTER TABLE "contact_page" DROP COLUMN "seo_description";`)
}
