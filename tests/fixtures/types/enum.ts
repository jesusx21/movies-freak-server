export default function ENUM(...args: string[]) {
  return {
    type: 'string',
    enum: args
  };
}
