type PtMessageType = "notify_clear";

type PtMessage<K extends PtMessageType> = {
  type: K;
};

type NotifyClearMessage = PtMessage<"notify_clear"> & {
  id: string;
};

type ReceiveMessage = NotifyClearMessage;
