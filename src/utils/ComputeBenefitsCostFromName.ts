import { BaseYearlyCostPerDependent } from "../constants";
import ComputeNameDiscount from "./ComputeNameDiscount";

const ComputeBenefitsCostFromName = (name: string): number => {
  return BaseYearlyCostPerDependent * ComputeNameDiscount(name);
};

export default ComputeBenefitsCostFromName;
