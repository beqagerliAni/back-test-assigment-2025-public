export type FunctionCallHandler = (
  name: string,
  args: string,
) => Promise<string | Record<string, unknown>>;
