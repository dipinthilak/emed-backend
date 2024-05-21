export class Adminentity {
    public  password?: string;
    public readonly email?: string;


    constructor (obj: any){        
        Object.assign(this, obj)
    }
}
