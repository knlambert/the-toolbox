
export class AppUser {
    constructor(
        public id: number, 
        public email: string, 
        public name: string,
        public default_role: object,
        public min_hours_per_week: number
    ){};
}