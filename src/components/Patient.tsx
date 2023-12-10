import { decodeMessage, setWakuStoreFunc } from '@/tools/waku/handle';
import { ISimpleChatMessage } from '@/utils/interfaces';
import { fetchData, getBlockNumbers } from '@/utils/powerloomCall';
import { IMessage, LightNode, createDecoder, createEncoder } from '@waku/sdk';

import protobuf from "protobufjs";
import React from 'react'
import Analytics from './analytics';
import Router from 'next/router';
const contentTopic = `/guide-curse/1/chat/proto`;
const encoder = createEncoder({ contentTopic: contentTopic });
const decoder = createDecoder(contentTopic);

interface Props {
    isDoctor: boolean;
}

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint32"))
    .add(new protobuf.Field("text", 2, "string"));

const Patient = ({ isDoctor }: Props) => {
    const [wakuStore, setWakuStore] = React.useState<LightNode | undefined>(undefined);
    const [wakuStoreStatus, setWakuStoreStatus] = React.useState<string>("None");
    const [avg, setAvg] = React.useState<any>({});
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
            setInterval(async () => {
                const date = new Date();
                const time = date.getTime();

                const num = Math.floor((Math.floor(Math.random()) + 30) * 3);
                const protoMsg = SimpleChatMessage.create({
                    timestamp: time,
                    text: String(Math.floor(num)),
                });
                const payload = SimpleChatMessage.encode(protoMsg).finish();
                const msgTime = new Date();

                msgTime.setTime(time);
                console.log("Heart Rate: ", num);
                if (num) {
                    try {

                        await wakuStore.lightPush.send(encoder, {
                            payload,
                        });
                        console.log("Sent to waku");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }, 4000)
        }
    }, [wakuStore, wakuStoreStatus]);
    const [chartData, setChartData] = React.useState<Array<any>>([]);
    React.useEffect(() => {
        async function fetch() {
            const arr: any = [];
            const epochs = getBlockNumbers()
            let ctr = 0;
            for (let i = 0; i < epochs.length; i++) {
                const res = await fetchData(epochs[i]);
                if (res?.activities.length > 0) {
                    arr.push({ name: `Day ${i}`, steps: res?.activities[0].steps });
                    avg.steps += Number(res?.activities[0].steps);
                    arr.push({ name: `Day ${i}`, heartRate: res?.activities[0].heartRate });
                    avg.heartRate += Number(res?.activities[0].heartRate);
                    arr.push({ name: `Day ${i}`, sleepDuration: res?.activities[0].sleepDuration });
                    avg.sleepDuration += Number(res?.activities[0].sleepDuration);
                    ctr++;
                }
                console.log(res);
            }
            avg.steps /= ctr;
            avg.heartRate /= ctr;
            avg.sleepDuration /= (ctr * 60);
            setAvg(avg);
            console.log(arr);
            setChartData(arr);
        }
        fetch();
    }, []);
    console.log(chartData);
    console.log(wakuStoreStatus);
    return (
        <div>
            <button onClick={() => {
                Router.push({ pathname: '/meet/gvb-wigv-wog' })
            }}>Meet the Doc</button>
            <Analytics data={chartData} avg={avg} /></div>

    )
}

export default Patient