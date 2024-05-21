export interface IAdminInteractor {
    signinAdmin(username: string, password: string):any;
    signoutAdmin(input:any ): Promise<void>;
    usersData(input:any ): any;
}
