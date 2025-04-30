export class Content {
    constructor(
        public textID: number,
        public categoryID: number,
        public title: string,
        public content: string,
        public signature: string,
        public userID: number,
        public createdAt: Date,//=new Date(),
        public updatedAt: Date
    ) { }
}