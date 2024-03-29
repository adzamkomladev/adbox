import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class Business {
    @Property()
    type!: string;

    @Property({ type: 'text' })
    url!: string;

    @Property({ nullable: true })
    taxNumber?: string;

    @Property({ nullable: true })
    category?: string;
}
