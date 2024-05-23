import { Migration } from '@mikro-orm/migrations';

export class Migration20240523114325_AddLikesAndViewsPropertiesOnCampaign extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "campaign" add column "likes" int not null default 0, add column "views" int not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "campaign" drop column "likes";');
    this.addSql('alter table "campaign" drop column "views";');
  }

}
