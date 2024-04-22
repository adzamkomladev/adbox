import { Migration } from '@mikro-orm/migrations';

export class Migration20240422100054_AddPerInteractionCost extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "campaign" add column "fee" int not null default 0, add column "per_interaction_cost" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "campaign" drop column "fee";');
    this.addSql('alter table "campaign" drop column "per_interaction_cost";');
  }

}
