import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class Identity {
    @Property()
    type!: string;

    @Property({ type: 'text' })
    url!: string;
}
