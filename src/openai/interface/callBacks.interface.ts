export interface StreamCallbacks {
  // btw in real life scenario you whould have more callbacks  know lets stick with 4 simple callbacks
  // onDelta will send ai live messages
  // onThreadRunCreated will notifay user that ai recived message and analyzing
  // onToolCall user will be notifayed that ai uses function call
  // and last one is error handle message
  onThreadRunCreated: () => void;
  onDelta: (textDelta: string) => void;
  onToolCall: (info: { status: 'calling' | 'finished'; name?: string }) => void;
  onCompleted: () => void;
  onError: (e: unknown) => void;
}
