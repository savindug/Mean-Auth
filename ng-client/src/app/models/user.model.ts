import { areAllEquivalent } from "@angular/compiler/src/output/output_ast";

export class UserModel {
    public accessToken!: string;
    public refreshToken!: string;
    constructor(private username: string, private email: string, private pwd: string ){}
}