export class Card {
    constructor(
        public cardID: number,
        public userID: number,
        public templateID: number,
        public textID: number,
        public categoryID: number,
        public canvasStyle: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}
