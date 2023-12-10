import { fetchData, getBlockNumbers } from '@/utils/powerloomCall';
import React from 'react'
import Analytics from './analytics';
import Chart from './Chart';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel'
const Powerloom = () => {
    const [chartData, setChartData] = React.useState<any>({});
    React.useEffect(() => {
        async function fetch() {
            const arr1: any = [];
            const arr2: any = [];
            const arr3: any = [];
            const epochs = getBlockNumbers()
            for (let i = 0; i < epochs.length; i++) {
                const res = await fetchData(epochs[i]);
                if (res?.activities.length > 0) {
                    arr1.push({ name: `Day ${i}`, steps: res?.activities[0].steps });
                    arr2.push({ name: `Day ${i}`, heartRate: res?.activities[0].heartRate });
                    arr3.push({ name: `Day ${i}`, sleepDuration: res?.activities[0].sleepDuration });
                }
                console.log(res);
            }
            setChartData({ arr1, arr2, arr3 });
        }
        fetch();
    }, []);
    console.log(chartData);
    return (
        <div className='w-[700px] h-full'>
            {chartData.length > 0 ?
                <div className='w-full h-full'>
                    <Chart data={chartData?.arr1} />
                    <Chart data={chartData?.arr2} />
                    <Chart data={chartData?.arr3} />
                </div>

                : <></>}
        </div>
    )
}

export default Powerloom