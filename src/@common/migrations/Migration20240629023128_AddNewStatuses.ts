import { Migration } from '@mikro-orm/migrations';

export class Migration20240629023128_AddNewStatuses extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_status_check";');

    this.addSql('alter table "payment" drop constraint if exists "payment_status_check";');

    this.addSql('alter table "campaign" drop constraint if exists "campaign_status_check";');

    this.addSql('alter table "attempt" drop constraint if exists "attempt_status_check";');

    this.addSql('alter table "wallet" drop constraint if exists "wallet_status_check";');

    this.addSql('alter table "wallet_transaction" drop constraint if exists "wallet_transaction_status_check";');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "payment_method" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "payment" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "payment" add constraint "payment_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "campaign" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "campaign" add constraint "campaign_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "attempt" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "attempt" add constraint "attempt_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "wallet" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet" add constraint "wallet_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');

    this.addSql('alter table "wallet_transaction" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\', \'paused\', \'stopped\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_status_check";');

    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_status_check";');

    this.addSql('alter table "payment" drop constraint if exists "payment_status_check";');

    this.addSql('alter table "campaign" drop constraint if exists "campaign_status_check";');

    this.addSql('alter table "attempt" drop constraint if exists "attempt_status_check";');

    this.addSql('alter table "wallet" drop constraint if exists "wallet_status_check";');

    this.addSql('alter table "wallet_transaction" drop constraint if exists "wallet_transaction_status_check";');

    this.addSql('alter table "user" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "user" add constraint "user_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "payment_method" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "payment" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "payment" add constraint "payment_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "campaign" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "campaign" add constraint "campaign_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "attempt" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "attempt" add constraint "attempt_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "wallet" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet" add constraint "wallet_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');

    this.addSql('alter table "wallet_transaction" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "wallet_transaction" add constraint "wallet_transaction_status_check" check ("status" in (\'active\', \'inactive\', \'pending\', \'deleted\', \'verified\', \'unverified\', \'approved\', \'unapproved\', \'rejected\', \'accepted\', \'failed\', \'completed\', \'incomplete\', \'blocked\', \'initiated\', \'not_started\'));');
  }

}
