import { Migration } from '@mikro-orm/migrations';

export class Migration20240924113610_UpdatePaymentMethodEnumFields extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_channel_check";');
    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_network_check";');

    this.addSql('alter table "payment" drop constraint if exists "payment_channel_check";');

    this.addSql('alter table "payment_method" alter column "channel" type text using ("channel"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_channel_check" check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_money\'));');
    this.addSql('alter table "payment_method" alter column "network" type text using ("network"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_network_check" check ("network" in (\'mtn\', \'telecel\', \'airteltigo\'));');

    this.addSql('alter table "payment" alter column "channel" type text using ("channel"::text);');
    this.addSql('alter table "payment" add constraint "payment_channel_check" check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_money\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_channel_check";');
    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_network_check";');

    this.addSql('alter table "payment" drop constraint if exists "payment_channel_check";');

    this.addSql('alter table "payment_method" alter column "channel" type text using ("channel"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_channel_check" check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\'));');
    this.addSql('alter table "payment_method" alter column "network" type text using ("network"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_network_check" check ("network" in (\'MTN\', \'VODAFONE\', \'AIRTEL_TIGO\'));');

    this.addSql('alter table "payment" alter column "channel" type text using ("channel"::text);');
    this.addSql('alter table "payment" add constraint "payment_channel_check" check ("channel" in (\'credit_card\', \'debit_card\', \'bank\', \'mobile_wallet\'));');
  }

}
