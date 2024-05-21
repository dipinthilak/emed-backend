export class Adminentity {
    public readonly name?: string;
    public readonly email?: string;
    public readonly phoneNo?: string;
    public  password?: string;

    constructor (obj: any){        
        Object.assign(this, obj)
    }
}
