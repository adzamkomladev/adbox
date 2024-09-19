import { Migration } from '@mikro-orm/migrations';

export class Migration20240919013428_AddCommentTable extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "campaign_id" varchar(255) not null, "value" varchar(255) not null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment" cascade;');
  }

}
