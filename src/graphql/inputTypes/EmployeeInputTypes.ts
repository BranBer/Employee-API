import { InputType, Field } from "type-graphql";

@InputType()
export class GetEmployeeArgs {
  @Field(() => String)
  id: string;
}

@InputType()
export class CreateEmployeeArgs {
  @Field(() => String)
  name: string;

  @Field(() => [String], { nullable: true })
  dependents: String[];
}

@InputType()
export class EditEmployeeArgs {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  newName: string;
}

@InputType()
export class AddDependentArgs {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  dependentName: string;
}

@InputType()
export class RemoveDependentArgs {
  @Field(() => String)
  dependentId: string;
}

@InputType()
export class EditDependentArgs {
  @Field(() => String)
  dependentId: string;

  @Field(() => String)
  newName: string;
}
