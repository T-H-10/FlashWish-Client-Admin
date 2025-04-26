export class GreetingCard {
    constructor(
        public cardID: number,
        public userID: number,
        public templateID: number,
        public textID: number,
        public categoryId: number,
        public canvasStyle: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}