export class Userentity {
    public readonly _id?: string;
    public readonly fullName?: string;
    public readonly googleId?: string;
    public password?: string;
    public confirmPassword?: string;
    public readonly email?: string;
    public readonly address?: string;
    public readonly pincode?: string;
    public readonly phoneNo?: string;
    public readonly gender?: string;
    public readonly dob?: Date;
    public readonly isActive?: boolean;
    public readonly isGoogle?: boolean;

    constructor(obj: any) {
        Object.assign(this, obj)
    }
}
