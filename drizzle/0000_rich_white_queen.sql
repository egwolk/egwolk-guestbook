CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "messages" USING btree ("user_id");