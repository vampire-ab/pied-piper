import React from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill }
    from 'react-icons/bs'
import { /*BarChart, Bar,*/ Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
    from 'recharts';
import Chart from './Chart';
type props = {
    data: any
    avg: any
}
const Analytics = ({ data, avg }: props) => {
    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>HEARTRATE</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{String(avg.heartRate)}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>AVERAGE SLEEP</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>{String(avg.sleepDuration)} hours</h1>
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
                {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="heartrate" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer> */}

                <Chart data={data} />

            </div>
        </main>
    )
}

export default Analytics