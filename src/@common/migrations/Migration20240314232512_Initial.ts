import { Migration } from '@mikro-orm/migrations';

export class Migration20240314232512_Initial extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "campaign" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "demographic" varchar(255) not null, "target_age" int not null, "target_reach" int not null, "budget" int not null, "link" varchar(255) not null, "start" timestamptz not null, "end" timestamptz not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "campaign_pkey" primary key ("id"));');
    this.addSql('create index "campaign_name_index" on "campaign" ("name");');

    this.addSql('create table "role" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(200) not null, "description" text not null, "code" varchar(100) not null, constraint "role_pkey" primary key ("id"));');
    this.addSql('create index "role_name_index" on "role" ("name");');
    this.addSql('alter table "role" add constraint "role_code_unique" unique ("code");');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "role_id" varchar(255) not null, "campaign_id" varchar(255) null, "firebase_id" varchar(255) null, "name" varchar(200) not null, "first_name" varchar(100) not null, "last_name" varchar(100) not null, "avatar" text not null, "email" varchar(100) not null, "password" varchar(255) null, "date_of_birth" date null, "sex" text check ("sex" in (\'male\', \'female\')) null, "role_title" varchar(100) null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_campaign_id_unique" unique ("campaign_id");');
    this.addSql('create index "user_name_index" on "user" ("name");');
    this.addSql('create index "user_first_name_index" on "user" ("first_name");');
    this.addSql('create index "user_last_name_index" on "user" ("last_name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "payment_method" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "currency" varchar(255) not null default \'GHS\', "channel" text check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\')) not null, "network" text check ("network" in (\'MTN\', \'VODAFONE\', \'AIRTEL_TIGO\')) not null, "network_code" varchar(255) not null, "account_number" varchar(255) not null, "account_name" varchar(255) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "payment_method_pkey" primary key ("id"));');

    this.addSql('create table "payment" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "wallet_id" varchar(255) null, "amount" int not null default 0, "currency" varchar(255) not null default \'GHS\', "channel_details" jsonb not null, "channel" text check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\')) not null, "reference" varchar(255) not null, "channel_request" varchar(255) null, "channel_response" varchar(255) null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, "activity" text check ("activity" in (\'WALLET_TOP_UP\', \'WALLET_WITHDRAWAL\', \'WALLET_TRANSFER\', \'TRANSFER_FEES\', \'CHARGE\')) not null, constraint "payment_pkey" primary key ("id"));');

    this.addSql('create table "kyc" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) null, "level" int not null default 1, "country" varchar(255) not null default \'GH\', "identity" jsonb null, "business" jsonb null, constraint "kyc_pkey" primary key ("id"));');
    this.addSql('alter table "kyc" add constraint "kyc_user_id_unique" unique ("user_id");');

    this.addSql('create table "attempt" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "kyc_id" varchar(255) not null, "updated_by_id" varchar(255) null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, "reason" varchar(255) null, "identity" jsonb null, "business" jsonb null, constraint "attempt_pkey" primary key ("id"));');

    this.addSql('create table "wallet" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) null, "balance" int not null default 0, "currency" varchar(255) not null default \'GHS\', "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "wallet_pkey" primary key ("id"));');
    this.addSql('alter table "wallet" add constraint "wallet_user_id_unique" unique ("user_id");');

    this.addSql('create table "wallet_transaction" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "wallet_id" varchar(255) not null, "payment_id" varchar(255) null, "amount" int not null, "before" int not null, "after" int not null, "reference" varchar(255) not null, "description" varchar(255) null, "type" text check ("type" in (\'DEBIT\', \'CREDIT\', \'REFUND\')) not null, "status" text check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\')) not null, constraint "wallet_transaction_pkey" primary key ("id"));');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_payment_id_unique" unique ("payment_id");');

    this.addSql('create table "webhook" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "data" varchar(255) not null, "service" text check ("service" in (\'zeepay\', \'mtn\', \'vodafone\', \'airteltigo\', \'expresspay\', \'arkesel\')) not null, constraint "webhook_pkey" primary key ("id"));');

    this.addSql('alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade on delete set null;');

    this.addSql('alter table "payment_method" add constraint "payment_method_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "payment" add constraint "payment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "kyc" add constraint "kyc_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "attempt" add constraint "attempt_kyc_id_foreign" foreign key ("kyc_id") references "kyc" ("id") on update cascade;');
    this.addSql('alter table "attempt" add constraint "attempt_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "wallet" add constraint "wallet_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_campaign_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_role_id_foreign";');

    this.addSql('alter table "payment_method" drop constraint "payment_method_user_id_foreign";');

    this.addSql('alter table "payment" drop constraint "payment_user_id_foreign";');

    this.addSql('alter table "kyc" drop constraint "kyc_user_id_foreign";');

    this.addSql('alter table "attempt" drop constraint "attempt_updated_by_id_foreign";');

    this.addSql('alter table "wallet" drop constraint "wallet_user_id_foreign";');

    this.addSql('alter table "wallet_transaction" drop constraint "wallet_transaction_payment_id_foreign";');

    this.addSql('alter table "attempt" drop constraint "attempt_kyc_id_foreign";');

    this.addSql('alter table "wallet_transaction" drop constraint "wallet_transaction_wallet_id_foreign";');

    this.addSql('drop table if exists "campaign" cascade;');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "payment_method" cascade;');

    this.addSql('drop table if exists "payment" cascade;');

    this.addSql('drop table if exists "kyc" cascade;');

    this.addSql('drop table if exists "attempt" cascade;');

    this.addSql('drop table if exists "wallet" cascade;');

    this.addSql('drop table if exists "wallet_transaction" cascade;');

    this.addSql('drop table if exists "webhook" cascade;');
  }

}
