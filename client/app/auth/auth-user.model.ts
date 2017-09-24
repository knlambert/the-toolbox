
export class AuthUser {
    constructor(
        public id: number, 
        public email: string, 
        public name: string,
        public token: string,
        public exp: number
    ){};
}
