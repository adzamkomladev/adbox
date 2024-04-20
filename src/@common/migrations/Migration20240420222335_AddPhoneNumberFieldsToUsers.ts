import { Migration } from '@mikro-orm/migrations';

export class Migration20240420222335_AddPhoneNumberFieldsToUsers extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "phone" varchar(20) null, add column "phone_verified_at" timestamptz null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "phone";');
    this.addSql('alter table "user" drop column "phone_verified_at";');
  }

}
