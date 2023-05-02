import { Migration } from '@mikro-orm/migrations';

export class Migration20230408233032 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "wallet" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "balance" int not null default 0, "currency" varchar(255) not null default \'GHS\', "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\')) not null, constraint "wallet_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "wallet_id" varchar(255) not null, "name" varchar(200) not null, "avatar" text not null, "email" varchar(100) not null, "password" varchar(255) null, "date_of_birth" date null, "role" text check ("role" in (\'admin\', \'publisher\', \'consumer\')) null, "sex" text check ("sex" in (\'male\', \'female\')) null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\')) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_wallet_id_unique" unique ("wallet_id");');
    this.addSql('create index "user_name_index" on "user" ("name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "wallet_transaction" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "wallet_id" varchar(255) not null, "amount" int not null, "before" int not null, "after" int not null, "reference" varchar(255) not null, "description" varchar(255) null, "type" text check ("type" in (\'DEBIT\', \'CREDIT\', \'REFUND\')) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\')) not null, constraint "wallet_transaction_pkey" primary key ("id"));');

    this.addSql('alter table "user" add constraint "user_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;');

    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;');
  }

}
