import { Embeddable, Property } from "@mikro-orm/core";

import { DetailsType } from "../enums/details.type.enum";

import { Details } from "./details.entity";

@Embeddable({ discriminatorValue: DetailsType.IDENTITY })
export class Identity extends Details {
    @Property()
    idType!: string;

    @Property({ type: 'text' })
    front!: string;

    @Property({ type: 'text' })
    back!: string;

    @Property({ type: 'text' })
    combined!: string;

    constructor() {
        super();
        this.type = DetailsType.IDENTITY;
        this.level = 2;
    }
}