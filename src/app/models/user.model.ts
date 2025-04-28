export class User {
    constructor(
    public id: number,
    public userName: string,
    public email: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date
    ) { }
}

export class JwtPayload{
    constructor(
        public id: string,
        public email: string,
        public role: string,
        public exp: number
    ){}
}