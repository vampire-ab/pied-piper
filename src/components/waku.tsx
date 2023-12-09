import { decodeMessage, setWakuStoreFunc } from '@/tools/waku/handle';
import { ISimpleChatMessage } from '@/utils/interfaces';
import { IMessage, LightNode, createDecoder, createEncoder } from '@waku/sdk';

import protobuf from "protobufjs";
import React from 'react'
const contentTopic = `/guide-curse/1/chat/proto`;
const encoder = createEncoder({ contentTopic: contentTopic });
const decoder = createDecoder(contentTopic);

interface Props {
    isDoctor: boolean;
    setIsDoctor: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint32"))
    .add(new protobuf.Field("text", 2, "string"));

const waku = ({ isDoctor, setIsDoctor }: Props) => {
    const [wakuStore, setWakuStore] = React.useState<LightNode | undefined>(undefined);
    const [wakuStoreStatus, setWakuStoreStatus] = React.useState<string>("None");
    const [messages, setMessages] = React.useState<Array<ISimpleChatMessage>>([]);
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
            (async () => {
                if (isDoctor) {
                    await wakuStore.filter.subscribe(decoder, (wakuMessage: IMessage) => {
                        if (!wakuMessage.payload) return;
                        const message: ISimpleChatMessage | undefined = decodeMessage(wakuMessage);
                        if (!message) return;
                        // const arrayedMsg: ISimpleChatMessage[] = [message];
                        // const allMessages: Array<ISimpleChatMessage> = arrayedMsg.concat(messages);
                        const chartData: any = [];
                        chartData.push(message);
                        if (chartData.length > 5) chartData.shift();
                        setMessages(
                            chartData
                        );
                    });
                }
                else {
                    setInterval(async () => {
                        const date = new Date();
                        const time = date.getTime();

                        const num = Math.random();
                        const protoMsg = SimpleChatMessage.create({
                            timestamp: time,
                            text: String(num),
                        });
                        const payload = SimpleChatMessage.encode(protoMsg).finish();
                        const msgTime = new Date();

                        msgTime.setTime(time);

                        await wakuStore.lightPush.send(encoder, {
                            payload,
                        });
                    }, 2000)
                }
            })();
        }
    }, [wakuStore, wakuStoreStatus]);
    return (
        <div>waku</div>

    )
}

export default waku