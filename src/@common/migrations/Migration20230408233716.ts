import { Migration } from '@mikro-orm/migrations';

export class Migration20230408233716 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_wallet_id_foreign";');

    this.addSql('alter table "user" alter column "wallet_id" type varchar(255) using ("wallet_id"::varchar(255));');
    this.addSql('alter table "user" alter column "wallet_id" drop not null;');
    this.addSql('alter table "user" add constraint "user_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_wallet_id_foreign";');

    this.addSql('alter table "user" alter column "wallet_id" type varchar(255) using ("wallet_id"::varchar(255));');
    this.addSql('alter table "user" alter column "wallet_id" set not null;');
    this.addSql('alter table "user" add constraint "user_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;');
  }

}
