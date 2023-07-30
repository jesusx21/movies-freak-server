export default function JSON(properties = {}, required = []) {
  return {
    type: 'object',
    properties,

    required
  };
}
