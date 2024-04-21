import { Migration } from '@mikro-orm/migrations';

export class Migration20240421193049_UpdateUserCampaignRelationship extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_campaign_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_campaign_id_unique";');
    this.addSql('alter table "user" drop column "campaign_id";');

    this.addSql('alter table "campaign" add column "user_id" varchar(255) not null, add column "description" text null;');
    this.addSql('alter table "campaign" add constraint "campaign_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "campaign" drop constraint "campaign_user_id_foreign";');

    this.addSql('alter table "campaign" drop column "user_id";');
    this.addSql('alter table "campaign" drop column "description";');

    this.addSql('alter table "user" add column "campaign_id" varchar(255) null;');
    this.addSql('alter table "user" add constraint "user_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade on delete set null;');
    this.addSql('alter table "user" add constraint "user_campaign_id_unique" unique ("campaign_id");');
  }

}
