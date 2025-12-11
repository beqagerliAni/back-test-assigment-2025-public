export type FunctionCallHandler<T> = (
  name: string,
  args: string,
  // custom data that we whont to add when useing some functionCall
  data?: T
) => Promise<string | Record<string, unknown>>;
