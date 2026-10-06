import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_group" AS ENUM('corporate', 'entertainment', 'community', 'technical');
  CREATE TYPE "public"."enum_disciplines_animation" AS ENUM('audio', 'visual', 'infrastructure');
  CREATE TYPE "public"."enum_gallery_items_category" AS ENUM('awards', 'live', 'community', 'crew');
  CREATE TYPE "public"."enum_gallery_items_aspect_ratio" AS ENUM('16 / 9', '3 / 2', '4 / 3', '1 / 1', '472 / 636', '742 / 832', '400 / 554', '588 / 425', '742 / 831');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"group" "enum_services_group" NOT NULL,
  	"summary" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"body" jsonb,
  	"order" numeric,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "disciplines_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "disciplines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"animation" "enum_disciplines_animation" DEFAULT 'audio' NOT NULL,
  	"image_id" integer,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "process_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "event_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar NOT NULL,
  	"category" "enum_gallery_items_category" NOT NULL,
  	"aspect_ratio" "enum_gallery_items_aspect_ratio" DEFAULT '3 / 2' NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"event_type" varchar,
  	"event_date" timestamp(3) with time zone,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"source_page" varchar,
  	"user_agent" varchar,
  	"ip_address" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"services_id" integer,
  	"disciplines_id" integer,
  	"process_steps_id" integer,
  	"event_types_id" integer,
  	"testimonials_id" integer,
  	"clients_id" integer,
  	"gallery_items_id" integer,
  	"form_submissions_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business_name" varchar DEFAULT 'Full Circle Event Production' NOT NULL,
  	"legal_name" varchar DEFAULT 'Full Circle Event Production Ltd',
  	"tagline" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address_street" varchar,
  	"address_town" varchar,
  	"address_county" varchar,
  	"address_postcode" varchar,
  	"maps_url" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"socials_instagram" varchar,
  	"socials_facebook" varchar,
  	"socials_youtube" varchar,
  	"og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline1" varchar DEFAULT 'From concept' NOT NULL,
  	"hero_headline2" varchar DEFAULT 'to completion' NOT NULL,
  	"hero_script" varchar DEFAULT 'Bring it full circle' NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"hero_primary_label" varchar DEFAULT 'Enquire here' NOT NULL,
  	"hero_primary_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"hero_secondary_label" varchar DEFAULT 'Come backstage' NOT NULL,
  	"hero_secondary_href" varchar DEFAULT '/gallery' NOT NULL,
  	"sticky_ticket_title" varchar DEFAULT 'Full Circle All Access' NOT NULL,
  	"sticky_ticket_strap" varchar DEFAULT 'Audio · Visual · Infrastructure' NOT NULL,
  	"sticky_ticket_line" varchar DEFAULT 'Site visit & tailored quote' NOT NULL,
  	"sticky_ticket_cta_label" varchar DEFAULT 'Get in touch' NOT NULL,
  	"sticky_ticket_cta_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"how_we_work_eyebrow" varchar DEFAULT 'How we work' NOT NULL,
  	"how_we_work_heading" varchar DEFAULT 'Every event comes full circle' NOT NULL,
  	"how_we_work_intro" varchar NOT NULL,
  	"services_eyebrow" varchar DEFAULT 'Our services' NOT NULL,
  	"services_heading" varchar DEFAULT 'Unique offerings' NOT NULL,
  	"services_intro" varchar NOT NULL,
  	"about_teaser_eyebrow" varchar DEFAULT 'About us' NOT NULL,
  	"about_teaser_heading" varchar DEFAULT 'Experts in live events & AV solutions' NOT NULL,
  	"about_teaser_body" varchar NOT NULL,
  	"about_teaser_image_id" integer NOT NULL,
  	"about_teaser_link_label" varchar DEFAULT 'Read more' NOT NULL,
  	"testimonials_eyebrow" varchar DEFAULT 'Testimonials' NOT NULL,
  	"testimonials_heading" varchar DEFAULT 'What our clients say' NOT NULL,
  	"clients_eyebrow" varchar DEFAULT 'Trusted by' NOT NULL,
  	"clients_intro" varchar NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"cta_accent" varchar,
  	"cta_new_line_before_accent" boolean DEFAULT false,
  	"cta_body" varchar,
  	"cta_image_id" integer NOT NULL,
  	"cta_primary_label" varchar DEFAULT 'Get a quote' NOT NULL,
  	"cta_primary_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"cta_secondary_label" varchar DEFAULT 'Come backstage' NOT NULL,
  	"cta_secondary_href" varchar DEFAULT '/gallery' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_what_we_do_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_what_we_do_event_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_history_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_history_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_location_towns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"delay" varchar DEFAULT '0s'
  );
  
  CREATE TABLE "about_page_commitment_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline1" varchar DEFAULT 'About' NOT NULL,
  	"hero_headline2" varchar DEFAULT 'Full Circle' NOT NULL,
  	"hero_script" varchar DEFAULT 'Expertise & passion' NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"what_we_do_eyebrow" varchar DEFAULT 'About Full Circle Event Production' NOT NULL,
  	"what_we_do_heading" varchar DEFAULT 'Whatever the event, we bring it to life' NOT NULL,
  	"what_we_do_intro" varchar NOT NULL,
  	"history_eyebrow" varchar DEFAULT 'Our history & expertise' NOT NULL,
  	"history_heading" varchar DEFAULT 'Two companies. One full circle.' NOT NULL,
  	"history_image_id" integer NOT NULL,
  	"history_company_one" varchar DEFAULT 'Company One' NOT NULL,
  	"history_company_two" varchar DEFAULT 'Company Two' NOT NULL,
  	"location_eyebrow" varchar DEFAULT 'Strategic location & accessibility' NOT NULL,
  	"location_heading" varchar DEFAULT 'Junction 34 of the M1' NOT NULL,
  	"location_body" varchar NOT NULL,
  	"location_address" varchar,
  	"commitment_eyebrow" varchar DEFAULT 'Our commitment to excellence' NOT NULL,
  	"commitment_heading" varchar DEFAULT 'Flawless productions, executed with precision' NOT NULL,
  	"commitment_body" varchar NOT NULL,
  	"commitment_image_id" integer NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"cta_accent" varchar,
  	"cta_new_line_before_accent" boolean DEFAULT false,
  	"cta_body" varchar,
  	"cta_image_id" integer NOT NULL,
  	"cta_primary_label" varchar DEFAULT 'Get a quote' NOT NULL,
  	"cta_primary_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"cta_secondary_label" varchar DEFAULT 'Come backstage' NOT NULL,
  	"cta_secondary_href" varchar DEFAULT '/gallery' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline1" varchar DEFAULT 'Our' NOT NULL,
  	"hero_headline2" varchar DEFAULT 'Services' NOT NULL,
  	"hero_script" varchar DEFAULT 'Unique offerings' NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"disciplines_eyebrow" varchar DEFAULT 'What we deliver' NOT NULL,
  	"disciplines_heading" varchar DEFAULT 'One team. Every element.' NOT NULL,
  	"disciplines_intro" varchar NOT NULL,
  	"events_eyebrow" varchar DEFAULT 'Events we produce' NOT NULL,
  	"events_heading" varchar DEFAULT 'Whatever you’re planning' NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"cta_accent" varchar,
  	"cta_new_line_before_accent" boolean DEFAULT false,
  	"cta_body" varchar,
  	"cta_image_id" integer NOT NULL,
  	"cta_primary_label" varchar DEFAULT 'Get a quote' NOT NULL,
  	"cta_primary_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"cta_secondary_label" varchar DEFAULT 'Come backstage' NOT NULL,
  	"cta_secondary_href" varchar DEFAULT '/gallery' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "backstage_page_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "backstage_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline1" varchar DEFAULT 'Come' NOT NULL,
  	"hero_headline2" varchar DEFAULT 'Backstage' NOT NULL,
  	"hero_script" varchar DEFAULT 'Our work in action' NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"gallery_eyebrow" varchar DEFAULT 'Our gallery' NOT NULL,
  	"gallery_heading" varchar DEFAULT 'Bringing events to life' NOT NULL,
  	"cta_heading" varchar NOT NULL,
  	"cta_accent" varchar,
  	"cta_new_line_before_accent" boolean DEFAULT false,
  	"cta_body" varchar,
  	"cta_image_id" integer NOT NULL,
  	"cta_primary_label" varchar DEFAULT 'Get a quote' NOT NULL,
  	"cta_primary_href" varchar DEFAULT '/contact-us' NOT NULL,
  	"cta_secondary_label" varchar DEFAULT 'Come backstage' NOT NULL,
  	"cta_secondary_href" varchar DEFAULT '/gallery' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_location_towns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"delay" varchar DEFAULT '0s'
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline1" varchar DEFAULT 'Let’s' NOT NULL,
  	"hero_headline2" varchar DEFAULT 'Talk' NOT NULL,
  	"hero_script" varchar DEFAULT 'We’re ready' NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"form_eyebrow" varchar DEFAULT 'Tell us about your event' NOT NULL,
  	"form_heading" varchar DEFAULT 'We’re ready, let’s talk.' NOT NULL,
  	"form_reply_note" varchar DEFAULT 'We usually reply within one working day.' NOT NULL,
  	"form_consent_label" varchar DEFAULT 'I agree to receive emails from Full Circle Event Production Ltd.' NOT NULL,
  	"form_error_message" varchar DEFAULT 'Please add your name, a valid email and a message so we can get back to you.' NOT NULL,
  	"info_ticket_line" varchar DEFAULT 'Free site visit & tailored quote' NOT NULL,
  	"info_ticket_heading" varchar DEFAULT 'Your access starts here' NOT NULL,
  	"info_socials_label" varchar DEFAULT 'Follow the crew' NOT NULL,
  	"location_eyebrow" varchar DEFAULT 'Junction 34 · M1' NOT NULL,
  	"location_heading" varchar DEFAULT 'Covering Yorkshire & beyond' NOT NULL,
  	"location_body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "disciplines_points" ADD CONSTRAINT "disciplines_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_disciplines_fk" FOREIGN KEY ("disciplines_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_process_steps_fk" FOREIGN KEY ("process_steps_id") REFERENCES "public"."process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_types_fk" FOREIGN KEY ("event_types_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_items_fk" FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_teaser_image_id_media_id_fk" FOREIGN KEY ("about_teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_hero_facts" ADD CONSTRAINT "about_page_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_what_we_do_capabilities" ADD CONSTRAINT "about_page_what_we_do_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_what_we_do_event_types" ADD CONSTRAINT "about_page_what_we_do_event_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_history_paragraphs" ADD CONSTRAINT "about_page_history_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_history_stats" ADD CONSTRAINT "about_page_history_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_location_towns" ADD CONSTRAINT "about_page_location_towns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_commitment_pillars" ADD CONSTRAINT "about_page_commitment_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_history_image_id_media_id_fk" FOREIGN KEY ("history_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_commitment_image_id_media_id_fk" FOREIGN KEY ("commitment_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_hero_facts" ADD CONSTRAINT "services_page_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "backstage_page_hero_facts" ADD CONSTRAINT "backstage_page_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."backstage_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "backstage_page" ADD CONSTRAINT "backstage_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "backstage_page" ADD CONSTRAINT "backstage_page_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_hero_facts" ADD CONSTRAINT "contact_page_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_location_towns" ADD CONSTRAINT "contact_page_location_towns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "disciplines_points_order_idx" ON "disciplines_points" USING btree ("_order");
  CREATE INDEX "disciplines_points_parent_id_idx" ON "disciplines_points" USING btree ("_parent_id");
  CREATE INDEX "disciplines_image_idx" ON "disciplines" USING btree ("image_id");
  CREATE INDEX "disciplines_updated_at_idx" ON "disciplines" USING btree ("updated_at");
  CREATE INDEX "disciplines_created_at_idx" ON "disciplines" USING btree ("created_at");
  CREATE INDEX "process_steps_updated_at_idx" ON "process_steps" USING btree ("updated_at");
  CREATE INDEX "process_steps_created_at_idx" ON "process_steps" USING btree ("created_at");
  CREATE INDEX "event_types_updated_at_idx" ON "event_types" USING btree ("updated_at");
  CREATE INDEX "event_types_created_at_idx" ON "event_types" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "gallery_items_image_idx" ON "gallery_items" USING btree ("image_id");
  CREATE INDEX "gallery_items_updated_at_idx" ON "gallery_items" USING btree ("updated_at");
  CREATE INDEX "gallery_items_created_at_idx" ON "gallery_items" USING btree ("created_at");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_disciplines_id_idx" ON "payload_locked_documents_rels" USING btree ("disciplines_id");
  CREATE INDEX "payload_locked_documents_rels_process_steps_id_idx" ON "payload_locked_documents_rels" USING btree ("process_steps_id");
  CREATE INDEX "payload_locked_documents_rels_event_types_id_idx" ON "payload_locked_documents_rels" USING btree ("event_types_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_items_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_items_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_about_teaser_about_teaser_image_idx" ON "home_page" USING btree ("about_teaser_image_id");
  CREATE INDEX "home_page_cta_cta_image_idx" ON "home_page" USING btree ("cta_image_id");
  CREATE INDEX "about_page_hero_facts_order_idx" ON "about_page_hero_facts" USING btree ("_order");
  CREATE INDEX "about_page_hero_facts_parent_id_idx" ON "about_page_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "about_page_what_we_do_capabilities_order_idx" ON "about_page_what_we_do_capabilities" USING btree ("_order");
  CREATE INDEX "about_page_what_we_do_capabilities_parent_id_idx" ON "about_page_what_we_do_capabilities" USING btree ("_parent_id");
  CREATE INDEX "about_page_what_we_do_event_types_order_idx" ON "about_page_what_we_do_event_types" USING btree ("_order");
  CREATE INDEX "about_page_what_we_do_event_types_parent_id_idx" ON "about_page_what_we_do_event_types" USING btree ("_parent_id");
  CREATE INDEX "about_page_history_paragraphs_order_idx" ON "about_page_history_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_history_paragraphs_parent_id_idx" ON "about_page_history_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_history_stats_order_idx" ON "about_page_history_stats" USING btree ("_order");
  CREATE INDEX "about_page_history_stats_parent_id_idx" ON "about_page_history_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_location_towns_order_idx" ON "about_page_location_towns" USING btree ("_order");
  CREATE INDEX "about_page_location_towns_parent_id_idx" ON "about_page_location_towns" USING btree ("_parent_id");
  CREATE INDEX "about_page_commitment_pillars_order_idx" ON "about_page_commitment_pillars" USING btree ("_order");
  CREATE INDEX "about_page_commitment_pillars_parent_id_idx" ON "about_page_commitment_pillars" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_history_history_image_idx" ON "about_page" USING btree ("history_image_id");
  CREATE INDEX "about_page_commitment_commitment_image_idx" ON "about_page" USING btree ("commitment_image_id");
  CREATE INDEX "about_page_cta_cta_image_idx" ON "about_page" USING btree ("cta_image_id");
  CREATE INDEX "services_page_hero_facts_order_idx" ON "services_page_hero_facts" USING btree ("_order");
  CREATE INDEX "services_page_hero_facts_parent_id_idx" ON "services_page_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "services_page_hero_hero_image_idx" ON "services_page" USING btree ("hero_image_id");
  CREATE INDEX "services_page_cta_cta_image_idx" ON "services_page" USING btree ("cta_image_id");
  CREATE INDEX "backstage_page_hero_facts_order_idx" ON "backstage_page_hero_facts" USING btree ("_order");
  CREATE INDEX "backstage_page_hero_facts_parent_id_idx" ON "backstage_page_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "backstage_page_hero_hero_image_idx" ON "backstage_page" USING btree ("hero_image_id");
  CREATE INDEX "backstage_page_cta_cta_image_idx" ON "backstage_page" USING btree ("cta_image_id");
  CREATE INDEX "contact_page_hero_facts_order_idx" ON "contact_page_hero_facts" USING btree ("_order");
  CREATE INDEX "contact_page_hero_facts_parent_id_idx" ON "contact_page_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "contact_page_location_towns_order_idx" ON "contact_page_location_towns" USING btree ("_order");
  CREATE INDEX "contact_page_location_towns_parent_id_idx" ON "contact_page_location_towns" USING btree ("_parent_id");
  CREATE INDEX "contact_page_hero_hero_image_idx" ON "contact_page" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "disciplines_points" CASCADE;
  DROP TABLE "disciplines" CASCADE;
  DROP TABLE "process_steps" CASCADE;
  DROP TABLE "event_types" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "gallery_items" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_hero_facts" CASCADE;
  DROP TABLE "about_page_what_we_do_capabilities" CASCADE;
  DROP TABLE "about_page_what_we_do_event_types" CASCADE;
  DROP TABLE "about_page_history_paragraphs" CASCADE;
  DROP TABLE "about_page_history_stats" CASCADE;
  DROP TABLE "about_page_location_towns" CASCADE;
  DROP TABLE "about_page_commitment_pillars" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "services_page_hero_facts" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "backstage_page_hero_facts" CASCADE;
  DROP TABLE "backstage_page" CASCADE;
  DROP TABLE "contact_page_hero_facts" CASCADE;
  DROP TABLE "contact_page_location_towns" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_group";
  DROP TYPE "public"."enum_disciplines_animation";
  DROP TYPE "public"."enum_gallery_items_category";
  DROP TYPE "public"."enum_gallery_items_aspect_ratio";`)
}
