function JSON(properties = {}, required: string[] = []) {
  return {
    type: 'object',
    properties,
    required
  };
}

export default JSON;
