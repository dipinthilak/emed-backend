export class Memberentity {
    public readonly _id?: string;
    public readonly fullName?: string;
    public readonly gender?: string;
    public readonly age?: Number;
    public readonly dob?: Date;
    public readonly height?: Number;
    public readonly bloodGroup?: string;
    public readonly weight?: Number;
    public readonly relation?: string;
    constructor(obj: any) {
        Object.assign(this, obj)
    }
}
