import { Migration } from '@mikro-orm/migrations';

export class Migration20240305105435_AddRoles extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "role" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(200) not null, "description" text not null, "code" varchar(100) not null, constraint "role_pkey" primary key ("id"));');
    this.addSql('create index "role_name_index" on "role" ("name");');
    this.addSql('alter table "role" add constraint "role_code_unique" unique ("code");');

    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_network_check";');

    this.addSql('alter table "user" add column "role_id" varchar(255) not null, add column "role_title" varchar(100) null;');
    this.addSql('alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;');
    this.addSql('alter table "user" drop column "role";');

    this.addSql('alter table "payment_method" alter column "network" type text using ("network"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_network_check" check ("network" in (\'MTN\', \'VODAFONE\', \'AIRTEL_TIGO\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_role_id_foreign";');

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('alter table "payment_method" drop constraint if exists "payment_method_network_check";');

    this.addSql('alter table "user" add column "role" text check ("role" in (\'admin\', \'publisher\', \'consumer\')) null;');
    this.addSql('alter table "user" drop column "role_id";');
    this.addSql('alter table "user" drop column "role_title";');

    this.addSql('alter table "payment_method" alter column "network" type text using ("network"::text);');
    this.addSql('alter table "payment_method" add constraint "payment_method_network_check" check ("network" in (\'MTN\', \'VODAFONE\', \'TIGO\'));');
  }

}
