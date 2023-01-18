import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Double,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { ObjectType, Field, Int, Float } from "type-graphql";
import { Dependent } from "./Dependent";
import ComputeNameDiscount from "../utils/ComputeNameDiscount";

@ObjectType()
@Entity()
export class Employee extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column({ default: 26, nullable: false })
  numberOfPaychecks: number;

  @Field(() => Float)
  @Column({ default: 2000, nullable: false })
  paycheck: number;

  @Field()
  @Column({ default: 1000, type: "decimal", nullable: false })
  yearlyBenefitsCost: number = 1000;

  @Field(() => [Dependent], { nullable: true, defaultValue: [] })
  @OneToMany(() => Dependent, (dependent) => dependent.employee, {
    cascade: ["insert", "update"],
  })
  public dependents: Dependent[];

  @BeforeInsert()
  DiscountBenefits() {
    this.yearlyBenefitsCost *= ComputeNameDiscount(this.name);
  }
}
