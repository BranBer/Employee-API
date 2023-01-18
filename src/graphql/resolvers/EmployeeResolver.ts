import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Dependent } from "../../entity/Dependent";
import { Employee } from "../../entity/Employee";
import ComputeBenefitsCostFromName from "../../utils/ComputeBenefitsCostFromName";
import ComputeNameDiscount from "../../utils/ComputeNameDiscount";
import {
  AddDependentArgs,
  CreateEmployeeArgs,
  GetEmployeeArgs,
  RemoveDependentArgs,
  EditDependentArgs,
  EditEmployeeArgs,
} from "../inputTypes/EmployeeInputTypes";

@Resolver()
export class EmployeeResolver {
  @Query(() => Employee)
  async GetEmployee(
    @Arg("input", { validate: false }) { id }: GetEmployeeArgs
  ) {
    const employee = await Employee.findOneOrFail({
      where: { id: id },
      relations: ["dependents"],
    });

    return employee;
  }

  @Query(() => [Employee], { defaultValue: [] })
  async GetEmployees() {
    const employees = await Employee.find({ relations: ["dependents"] });
    return employees;
  }

  @Mutation(() => Employee, { nullable: true })
  async CreateEmployee(
    @Arg("input", { validate: false }) { name, dependents }: CreateEmployeeArgs
  ) {
    const newDependents = [];

    if (dependents)
      dependents.forEach((dependent) => {
        const d = Dependent.create({ name: dependent.toString() });
        newDependents.push(d);
      });

    const employee = Employee.create({ name, dependents: newDependents });
    await employee.save();

    return employee;
  }

  @Mutation(() => Employee)
  async EditEmployee(
    @Arg("input", { validate: false }) { employeeId, newName }: EditEmployeeArgs
  ) {
    const employee = await Employee.findOneOrFail({
      where: { id: employeeId },
      relations: ["dependents"],
    });
    employee.name = newName;
    employee.yearlyBenefitsCost += 1000 - 1000 * ComputeNameDiscount(newName);
    employee.save();

    return employee;
  }

  @Mutation(() => Employee, { nullable: true })
  async AddDependent(
    @Arg("input", { validate: false })
    { employeeId, dependentName }: AddDependentArgs
  ) {
    const employee = await Employee.findOne({
      where: { id: employeeId },
      relations: ["dependents"],
    });

    if (!employee) throw new Error("Employee not found");

    const newDependent = await Dependent.create({ name: dependentName });
    newDependent.employee = employee;
    await newDependent.save();

    employee.dependents.push(newDependent);
    employee.yearlyBenefitsCost +=
      newDependent.additionalCostToEmployeeBenefits;
    employee.save();
    return employee;
  }

  @Mutation(() => String, { nullable: true })
  async RemoveDependent(
    @Arg("input", { validate: false }) { dependentId }: RemoveDependentArgs
  ) {
    const dependent = await Dependent.findOneOrFail({
      where: { id: dependentId },
      relations: ["employee"],
    });

    await Employee.update(dependent.employee.id, {
      yearlyBenefitsCost:
        dependent.employee.yearlyBenefitsCost -
        dependent.additionalCostToEmployeeBenefits,
    });
    const deletedDependent = await Dependent.delete(dependentId);

    if (deletedDependent.affected)
      return "Deleted dependent with id " + dependentId;

    throw new Error("Dependent not found");
  }

  @Mutation(() => String, { nullable: true })
  async EditDependent(
    @Arg("input", { validate: false })
    { dependentId, newName }: EditDependentArgs
  ) {
    const dependent = await Dependent.findOneOrFail({
      where: { id: dependentId },
    });

    const newCost: number =
      dependent.employee.yearlyBenefitsCost +
      (ComputeBenefitsCostFromName(newName) -
        dependent.additionalCostToEmployeeBenefits);

    await Employee.update(dependent.employee.id, {
      yearlyBenefitsCost: newCost,
    });
    await Dependent.update(dependentId, { name: newName });

    return "Updated dependent";
  }
}
