import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BaseEntity,
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  AfterUpdate,
  EventSubscriber,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Employee } from "./Employee";
import ComputeBenefitsCostFromName from "../utils/ComputeBenefitsCostFromName";

@ObjectType()
@Entity()
export class Dependent extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  // For tax benefit purposes a person can only be a dependent of one person
  @ManyToOne(() => Employee, (employee) => employee.dependents)
  employee: Employee;

  @Column({ default: 1000, type: "decimal" })
  additionalCostToEmployeeBenefits: number;

  @BeforeInsert()
  @BeforeUpdate()
  UpdateAdditionalCostToEmployeeBenefits() {
    this.additionalCostToEmployeeBenefits = ComputeBenefitsCostFromName(
      this.name
    );
  }
}
