import React from 'react'
import { Line } from 'react-chartjs-2'
import { Col, Row, Typography } from 'antd'
import Chart from 'chart.js/auto'

const { Title } = Typography

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
    const coinPrice = []
    const coinTimeStamp = []

    for (let i = 0; i < coinHistory?.data?.history?.length; ++i) {
        coinPrice.push(coinHistory?.data?.history[i].price)
        coinTimeStamp.push(
            new Date(
                coinHistory?.data?.history[i].timestamp * 1000
            ).toLocaleDateString()
        )
    }

    coinTimeStamp.reverse()
    coinPrice.reverse()
    const data = {
        labels: coinTimeStamp,
        datasets: [
            {
                label: 'Price in USD',
                data: coinPrice,
                backgroundColor: '#0071bd',
                borderColor: '#00711bd',
            },
        ],
    }

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
            xAxes: [
                {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: { day: 'MMM D' },
                    },
                    distribution: 'series',
                    offset: true,
                },
            ],
        },
    }

    return (
        <>
            <Row className='chart-header'>
                <Title level={2} className='chart-title'>
                    {coinName} Price Chart
                    <Col className='price-container'>
                        <Title level={5} className='price-change'>
                            {coinHistory?.data?.change}%
                        </Title>
                        <Title level={5} className='current-price'>
                            Current {coinName} Price: $ {currentPrice}
                        </Title>
                    </Col>
                </Title>
            </Row>
            <Line data={data} options={options}></Line>
        </>
    )
}

export default LineChart
