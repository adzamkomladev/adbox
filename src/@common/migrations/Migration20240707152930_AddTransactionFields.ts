import { Migration } from '@mikro-orm/migrations';

export class Migration20240707152930_AddTransactionFields extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "wallet_transaction_change" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "transaction_id" varchar(255) not null, "updated_by_id" varchar(255) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\')) not null, "start_date" timestamptz not null, "end_date" timestamptz null, "reason" varchar(255) null, constraint "wallet_transaction_change_pkey" primary key ("id"));');

    this.addSql('alter table "wallet_transaction_change" add constraint "wallet_transaction_change_transaction_id_foreign" foreign key ("transaction_id") references "wallet_transaction" ("id") on update cascade;');
    this.addSql('alter table "wallet_transaction_change" add constraint "wallet_transaction_change_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "wallet_transaction" add column "fee" int not null default 0, add column "link_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "wallet_transaction_change" cascade;');

    this.addSql('alter table "wallet_transaction" drop column "fee";');
    this.addSql('alter table "wallet_transaction" drop column "link_id";');
  }

}
