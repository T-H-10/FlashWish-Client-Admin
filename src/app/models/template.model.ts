export class Template{
    constructor(
        public templateID: number,
        public templateName: string,
        public categoryID: number,
        public userID: number,
        public markedForDeletion: boolean,
        public ImageURL: string,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}