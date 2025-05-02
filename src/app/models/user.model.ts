export class User {
    constructor(
    public id: number,
    public userName: string,
    public email: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
    public roles: string[]
    ) { }
}

export class JwtPayload{
    constructor(
        public key: any,  // כל מפתח יכול להיות כל ערך
        public exp: number,
        public iss: string,
        public aud: string,
        public role: string[],  // role יהיה מערך של תפקידים
        public email: string,
    ){}
}