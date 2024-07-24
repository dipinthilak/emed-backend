export class Doctorentity {
    public _id?: string;
    public readonly fullName?: string;
    public readonly email?: string;
    public readonly googleId?: string;
    public password?: string;
    public confirmPassword?: string;
    
    public readonly isGoogle?: boolean;
    public readonly isActive?: boolean;
    public readonly isVerified?: boolean;
    public readonly verified?: boolean;

    public readonly address?: string;
    public readonly pincode?: string;
    public readonly phoneNo?: string;
    public readonly profilePic?:string;
    public readonly identityProof?: string;
    public readonly identityProofId?: string;
    public readonly identityProofDoc?: string;
    public readonly gender?: string;
    public readonly dob?: Date;
    public readonly department?: string;


    public readonly highSchool?: string;
    public readonly hsNumber?: string;
    public readonly hsYear?: number | string;
    public readonly hsDoc?: string;
    public readonly hsSchool?: string;
    public readonly hssNo?: string;
    public readonly hssYear?: number | string;
    public readonly hssDoc?: string;
    public readonly mbbsCollege?: string;
    public readonly mbbsNo?: string;
    public readonly mbbsYear?: number | string;
    public readonly mbbsDoc?: string;
    public readonly registrationNo?: number | string;
    public readonly education?: Education[];
    public readonly eduDocs?:[String];
    public readonly about?:String;
    public readonly ecperiences?:Experience[];
    public readonly expDocs?:[String];
    constructor(obj: any) {
        Object.assign(this, obj)
    }
}

class Education {
    public readonly institution?: string;
    public readonly degree?: string;
    public readonly field?: string;
    public readonly gradYear?: number | string;
    constructor(obj: any) {
        Object.assign(this, obj)
    }
}

class Experience {
    public readonly from?: number;
    public readonly to?: number;
    public readonly experience?: string;
    constructor(obj: any) {
        Object.assign(this, obj)
    }
}
