import * as React from "react";
import { NextPage } from "next";
import protobuf from "protobufjs";
import {
    createDecoder,
    createEncoder,
    LightNode,
    IMessage,
    Unsubscribe,
} from "@waku/sdk";
import {
    decodeMessage,
    setWakuStoreFunc,
} from "@/tools/waku/handle";
import { ISimpleChatMessage } from "@/utils/interfaces";


const contentTopic = `/guide-curse/1/chat/proto`;
const encoder = createEncoder({ contentTopic: contentTopic });
const decoder = createDecoder(contentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint32"))
    .add(new protobuf.Field("text", 2, "string"));

const other: NextPage = () => {
    // const { node, error, isLoading } = useWaku();
    const [currentMsg, setCurrentMsg] = React.useState("");
    const [wakuStore, setWakuStore] = React.useState<LightNode | undefined>(undefined);
    const [wakuStoreStatus, setWakuStoreStatus] = React.useState<string>("None");
    const [messages, setMessages] = React.useState<Array<ISimpleChatMessage>>([]);

    React.useEffect(() => {
        if (wakuStore && wakuStoreStatus === "Ready") {
            let deleteObserver = wakuStore.filter.subscribe(
                // Pass the content topic to only process messages related to your dApp            
                decoder,
                (wakuMessage: IMessage) => {
                    if (!wakuMessage.payload) return;
                    const message: ISimpleChatMessage | undefined = decodeMessage(wakuMessage);
                    if (!message) return;
                    const arrayedMsg: ISimpleChatMessage[] = [message];
                    const allMessages: Array<ISimpleChatMessage> = arrayedMsg.concat(messages);
                    console.log(allMessages);
                    setMessages(allMessages);
                });
        }
    }, [wakuStore, wakuStoreStatus]);

    React.useEffect(() => {
        if (wakuStoreStatus === "None") {
            // Connect to store and filter node.
            (async () => {
                setWakuStoreStatus("Starting");
                setWakuStore(await setWakuStoreFunc());
                setWakuStoreStatus("Connected");
            })();
        }

        if (wakuStoreStatus === "Connected" && wakuStore) {
            const startTime = new Date();
            const endTime = new Date();
            // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
            startTime.setTime(startTime.getTime() - 10 * 24 * 60 * 60 * 1000);

            const queryOptions = {
                timeFilter: {
                    startTime,
                    endTime,
                },
            };
            // retrieveMsgs(wakuStore, endTime, startTime, contentTopic).then((data: any) => {
            //     setMessages(data.msgs);
            // });
            (async () => {
                await wakuStore.filter.subscribe(decoder, (wakuMessage: IMessage) => {
                    if (!wakuMessage.payload) return;
                    const message: ISimpleChatMessage | undefined = decodeMessage(wakuMessage);
                    if (!message) return;
                    const arrayedMsg: ISimpleChatMessage[] = [message];
                    const allMessages: Array<ISimpleChatMessage> = arrayedMsg.concat(messages);
                    console.log(allMessages);
                    setMessages(
                        allMessages
                    );
                });
            })();
            setWakuStoreStatus("Ready");
        }
    }, [wakuStore, wakuStoreStatus]);

    const sendMessageOnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, currentMsg: string) => {
        if (currentMsg.length === 0 || !wakuStore) return;
        e.preventDefault();
        try {
            // Check Waku is started and connected first.
            const date = new Date();
            const time = date.getTime();

            console.log(currentMsg, time);
            // Encode to protobuf
            const protoMsg = SimpleChatMessage.create({
                timestamp: time,
                text: currentMsg,
            });
            const payload = SimpleChatMessage.encode(protoMsg).finish();
            const msgTime = new Date();

            msgTime.setTime(time);

            await wakuStore.lightPush.send(encoder, {
                payload,
            });
            // setMessages([protoMsg].concat(messages));
            setCurrentMsg("");
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="App">
            <header className="App-header">
                <p>{wakuStoreStatus}</p>
                <form>
                    <label>
                        <input
                            type="text"
                            className="bg-transparent border p-3 rounded "
                            onChange={(e) => setCurrentMsg(e.target.value)}
                            value={currentMsg}
                        ></input>
                    </label>
                    <button
                        type="submit"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => sendMessageOnClick(e, currentMsg)}
                    >
                        Send Message
                    </button>
                </form>
                <ul className="text-white">
                    {messages?.map((msg: ISimpleChatMessage, idx: number) => {

                        return (
                            <li key={idx}>
                                {msg && <p>
                                    {msg?.timestamp?.toString()}: {msg?.text}
                                </p>}
                            </li>
                        );

                    })}
                </ul>
            </header>
        </div>
    );
}

export default other;
