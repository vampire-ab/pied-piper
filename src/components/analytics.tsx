import React from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
    from 'react-icons/bs'
import { /*BarChart, Bar,*/ Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
    from 'recharts';
import StepsChart from './StepsChart';
import HeartChart from './HeartChart';
import SleepChart from './SleepChart';
import { Carousel } from 'react-responsive-carousel';
type props = {
    data: any
    avg: any
}
const Analytics = ({ data, avg }: props) => {
    return (
        <main className='main-container'>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>HEART RATE</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{String(avg.heartRate)}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>AVERAGE SLEEP</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>{String(Math.trunc(avg.sleepDuration))} hours</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>STEPS</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{String(avg.steps)}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>BMI</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1>30.9</h1>
                </div>
            </div>

            <div className='charts'>
                <Carousel>
                    <div>
                        <StepsChart data={data} key="steps" />
                    </div>
                    <div>

                        <HeartChart data={data} key="heartRate" />
                    </div>
                    <div>

                        <SleepChart data={data} key="sleepDuration" />
                    </div>
                </Carousel>
            </div>
        </main>
    )
}

export default Analytics