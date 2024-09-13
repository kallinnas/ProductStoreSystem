export class User {
    id!: string;
    role!: number;
    name!: string;
    email!: string;
    password!: string;
}

export class UserAuthDto {
    email: string;
    password: string;

    constructor(email: string, password: string) { this.email = email; this.password = password; }
}

export class UserSignalrDto {
    id!: string;
    name!: string;
    signalrId!: string;
}
