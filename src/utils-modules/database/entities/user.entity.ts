import { Entity, PrimaryColumn, Column } from "typeorm";
import { User } from "@modules/users/domain/models/user.model";
import { Role } from "@modules/auth/domain/enums/role.enum";

@Entity("users")
export class UserEntity {
    @PrimaryColumn()
    id!: string;

    @Column({})
    firstname!: string;

    @Column()
    lastname!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    doc_type?: string;

    @Column({ nullable: true })
    doc_number?: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.CUSTOMER,
    })
    role!: Role;

    loadModel(model: User) {
        this.id = model.id;
        this.firstname = model.firstname;
        this.lastname = model.lastname;
        this.email = model.email;
        this.password = model.password;
        this.phone = model.phone;
        this.doc_type = model.docType;
        this.doc_number = model.docNumber;
        this.role = model.role;
    }

    toModel(): User {
        return new User(
            this.firstname,
            this.lastname,
            this.email,
            this.password,
            this.role,
            {
                id: this.id,
                phone: this.phone,
                docType: this.doc_type,
                docNumber: this.doc_number,
            }
        );
    }
}
