export class Departmententity {
    public readonly _id?: string;
    public readonly name?: string;
    public readonly about?: string;
    public readonly image?: string;
    public readonly isActive?: boolean;

    constructor (obj: any){        
        Object.assign(this, obj)
    }
}
