import { Migration } from '@mikro-orm/migrations';

export class Migration20240422092903_AddInteractionsTablesForCampaigns extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "interaction" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "campaign_id" varchar(255) not null, "liked" boolean not null default false, "credit" int not null default 0, "views" int not null default 0, constraint "interaction_pkey" primary key ("id"));');

    this.addSql('alter table "interaction" add constraint "interaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "interaction" add constraint "interaction_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade;');

    this.addSql('alter table "campaign" rename column "link" to "asset";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "interaction" cascade;');

    this.addSql('alter table "campaign" rename column "asset" to "link";');
  }

}
