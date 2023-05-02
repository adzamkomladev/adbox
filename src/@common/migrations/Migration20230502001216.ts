import { Migration } from '@mikro-orm/migrations';

export class Migration20230502001216 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "payment_method" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "currency" varchar(255) not null default \'GHS\', "channel" text check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\')) not null, "network" text check ("network" in (\'MTN\', \'VODAFONE\', \'TIGO\')) not null, "network_code" varchar(255) not null, "account_number" varchar(255) not null, "account_name" varchar(255) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "payment_method_pkey" primary key ("id"));');

    this.addSql('create table "payment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "wallet_id" varchar(255) null, "amount" int not null default 0, "currency" varchar(255) not null default \'GHS\', "channel_details" jsonb not null, "channel" text check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\')) not null, "reference" varchar(255) not null, "channel_request" varchar(255) null, "channel_response" varchar(255) null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, "activity" text check ("activity" in (\'WALLET_TOP_UP\', \'WALLET_WITHDRAWAL\', \'WALLET_TRANSFER\', \'TRANSFER_FEES\', \'CHARGE\')) not null, constraint "payment_pkey" primary key ("id"));');

    this.addSql('create table "webhook" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "data" varchar(255) not null, "service" text check ("service" in (\'zeepay\', \'mtn\', \'vodafone\', \'airteltigo\', \'expresspay\', \'arkesel\')) not null, constraint "webhook_pkey" primary key ("id"));');

    this.addSql('alter table "payment_method" add constraint "payment_method_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "payment" add constraint "payment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "wallet" drop constraint if exists "wallet_status_check";');

    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "wallet_transaction" drop constraint if exists "wallet_transaction_status_check";');

    this.addSql('alter table "wallet" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet" add constraint "wallet_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\'));');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\'));');

    this.addSql('alter table "wallet_transaction" add column "payment_id" varchar(255) null;');
    this.addSql('alter table "wallet_transaction" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\'));');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete set null;');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_payment_id_unique" unique ("payment_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "wallet_transaction" drop constraint "wallet_transaction_payment_id_foreign";');

    this.addSql('drop table if exists "payment_method" cascade;');

    this.addSql('drop table if exists "payment" cascade;');

    this.addSql('drop table if exists "webhook" cascade;');

    this.addSql('alter table "wallet" drop constraint if exists "wallet_status_check";');

    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "wallet_transaction" drop constraint if exists "wallet_transaction_status_check";');

    this.addSql('alter table "wallet" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet" add constraint "wallet_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\'));');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\'));');

    this.addSql('alter table "wallet_transaction" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\'));');
    this.addSql('alter table "wallet_transaction" drop constraint "wallet_transaction_payment_id_unique";');
    this.addSql('alter table "wallet_transaction" drop column "payment_id";');
  }

}
