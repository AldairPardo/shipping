import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "@modules/users/domain/models/user.model";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { ShipmentEntity } from "./shipment.entity";

@Entity("user")
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

    @Column()
    phone!: string;

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

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => ShipmentEntity, (shipment) => shipment.sender)
    shipments?: ShipmentEntity[];

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
        this.created_at = model.createdAt;
        this.updated_at = model.updatedAt;
    }

    toModel(): User {
        return new User(
            this.firstname,
            this.lastname,
            this.email,
            this.phone,
            this.password,
            this.role,
            {
                id: this.id,
                docType: this.doc_type,
                docNumber: this.doc_number,
                createdAt: this.created_at,
                updatedAt: this.updated_at,
            }
        );
    }
}
