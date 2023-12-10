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
                    arr1.push({ steps: res?.activities[0].steps });
                    arr2.push({ heartRate: res?.activities[0].heartRate });
                    arr3.push({ sleepDuration: res?.activities[0].sleepDuration });
                }
                console.log(res);
            }
            setChartData({ arr1, arr2, arr3 });
        }
        fetch();
    }, []);
    console.log(chartData);
    return (
        <div className=''>
            {chartData?.arr1?.length > 0 ?
                <div className=''>
                    <Carousel autoPlay>
                        <div>

                            <Chart data={chartData?.arr1} key="steps"/>
                        </div>
                        <div>

                            <Chart data={chartData?.arr2} key="heartRate"/>
                        </div>
                        <div>

                            <Chart data={chartData?.arr3} key="sleepDuration" />
                        </div>
                    </Carousel>
                </div>

                : <></>}
        </div>
    )
}

export default Powerloom