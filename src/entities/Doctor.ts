export class Doctorentity {
    public readonly fullName?: string;
    public readonly email?: string;
    public readonly registerNo?: string;
    public readonly department?: string;
    public readonly address?: string;
    public readonly pincode?: string;
    public readonly phoneNo?: string;
    public readonly gender?: string;
    public readonly dob?: Date;
    public password?: string;
    public confirmPassword?: string;
    public readonly isActive?: boolean;
    public readonly isGoogle?: boolean;

    constructor (obj: any){        
        Object.assign(this, obj)
    }
}
