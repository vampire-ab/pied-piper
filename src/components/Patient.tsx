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
                console.log("Current Heart Rate: ", num);
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
            const avvg = { steps: 0, heartRate: 0, sleepDuration: 0 };
            for (let i = 0; i < epochs.length; i++) {
                const res = await fetchData(epochs[i]);
                if (res?.activities.length > 0) {
                    arr.push({ steps: res?.activities[0].steps });
                    avvg.steps += Number(res?.activities[0].steps);
                    arr.push({ heartRate: res?.activities[0].heartRate });
                    avvg.heartRate += Number(res?.activities[0].heartRate);
                    arr.push({ sleepDuration: res?.activities[0].sleepDuration });
                    avvg.sleepDuration += Number(res?.activities[0].sleepDuration);
                    ctr++;
                }
                console.log(res);
            }
            avvg.steps /= ctr;
            avvg.heartRate /= ctr;
            avvg.sleepDuration /= (ctr * 60);
            setAvg(avvg);
            console.log(avvg);
            setChartData(arr);
        }
        fetch();
    }, []);
    console.log(chartData);
    console.log(wakuStoreStatus);
    return (
        <div >
            <div className='flex justify-between'>

            <div className='flex'> Dashboard</div>
            <button className='bg-purple-600 p-3 rounded shadow-lg' onClick={() => {
                Router.push({ pathname: '/meet/gvb-wigv-wog' })
            }}>Meet the Doctor</button>
            </div>
            <Analytics data={chartData} avg={avg} /></div>

    )
}

export default Patient