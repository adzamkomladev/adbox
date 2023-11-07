import { Migration } from '@mikro-orm/migrations';

export class Migration20231107202422_AddFirebaseIdToUserModel extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "firebase_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "firebase_id";');
  }

}
