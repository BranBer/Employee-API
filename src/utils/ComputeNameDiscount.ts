const ComputeNameDiscount = (name: string) => {
  if (name.toLocaleLowerCase()[0] === "a") return 0.9;

  return 1.0;
};

export default ComputeNameDiscount;
