import { Embeddable, Property } from "@mikro-orm/core";

import { DetailsType } from "../../../../kyc/enums/details.type.enum";

import { Details } from "./details.entity";

@Embeddable({ discriminatorValue: DetailsType.BUSINESS })
export class Business extends Details {
    @Property()
    docType!: string;

    @Property({ type: 'text' })
    url!: string;

    @Property({ nullable: true })
    taxNumber?: string;

    @Property({ nullable: true })
    category?: string;

    constructor() {
        super();
        this.type = DetailsType.BUSINESS;
        this.level = 4;
    }
}
