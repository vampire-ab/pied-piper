import Messages, { Message } from "@/tools/waku/messaging/Messages";
import type { RelayNode } from "@waku/interfaces";
import SendMessage from "./SendMessage";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    margin: "5px",
  },
});

interface Props {
  waku: RelayNode | undefined;
  recipients: Map<string, Uint8Array>;
  messages: Message[];
}

export default function Messaging({ waku, recipients, messages }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SendMessage recipients={recipients} waku={waku} />
      <Messages messages={messages} />
    </div>
  );
}