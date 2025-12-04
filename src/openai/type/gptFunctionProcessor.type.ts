import { Subscriber } from 'rxjs';

export type GptFunctionProcessor = (
  args: any,
  agentName?: string | null,
  functionName?: string | null,
  observer?: Subscriber<MessageEvent>,
) => Promise<string>;
