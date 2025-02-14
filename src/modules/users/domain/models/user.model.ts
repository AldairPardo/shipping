import { v1 as uuid } from "uuid";
import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { UserDto } from "../dtos/user.dto";


export class User {
    readonly id: string;
    readonly phone?: string;
    readonly docType?: string;
    readonly docNumber?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        readonly firstname: string,
        readonly lastname: string,
        readonly email: string,
        readonly password: string,
        readonly role: Role = Role.CUSTOMER,
        options?: {
            id?: string;
            phone?: string;
            docType?: string;
            docNumber?: string;
            createdAt?: Date;
            updatedAt?: Date;
        }
    ) {
        this.id = options?.id ?? User.newId;
        this.phone = options?.phone;
        this.docType = options?.docType;
        this.docNumber = options?.docNumber;
        this.createdAt = options?.createdAt ?? new Date();
        this.updatedAt = options?.updatedAt ?? new Date();
    }

    toJson(): UserDto {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            phone: this.phone,
            docType: this.docType,
            docNumber: this.docNumber,
            role: this.role,
        };
    }

    static fromJson(json: UserDto): User {
        return new User(
            json.firstname,
            json.lastname,
            json.email,
            json.password,
            json.role,
            {
                id: json.id,
                phone: json.phone,
                docType: json.docType,
                docNumber: json.docNumber,
            }
        );
    }

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
    private static get newId(): string {
        const baseId = uuid();
        const hash = createHash("md5").update(baseId);
        return hash.digest("hex").slice(0, 8).toUpperCase();
    }
}
