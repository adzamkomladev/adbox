import { Migration } from '@mikro-orm/migrations';

export class Migration20230810173654 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "campaign" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "demographic" varchar(255) not null, "target_age" int not null, "target_reach" int not null, "budget" int not null, "link" varchar(255) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "campaign_pkey" primary key ("id"));');
    this.addSql('create index "campaign_name_index" on "campaign" ("name");');

    this.addSql('alter table "user" add column "campaign_id" varchar(255) null;');
    this.addSql('alter table "user" add constraint "user_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_campaign_id_unique" unique ("campaign_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_campaign_id_foreign";');

    this.addSql('drop table if exists "campaign" cascade;');

    this.addSql('alter table "user" drop constraint "user_campaign_id_unique";');
    this.addSql('alter table "user" drop column "campaign_id";');
  }

}
