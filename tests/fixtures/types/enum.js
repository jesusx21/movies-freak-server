export default function ENUM(...args) {
  return {
    type: 'string',
    enum: args
  };
}
