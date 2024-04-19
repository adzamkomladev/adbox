import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class Identity {
    @Property()
    type!: string;

    @Property({ type: 'text' })
    front!: string;

    @Property({ type: 'text' })
    back!: string;

    @Property({ type: 'text' })
    combined!: string;
}
