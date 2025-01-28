import React, { useEffect, useState } from 'react'
import millify from 'millify'
import { Typography, Row, Col, Statistic } from 'antd'
import { Link } from 'react-router-dom'

import { useGetCryptosQuery } from '../services/cryptoApi'
import Cryptocurrencies from './Cryptocurrencies'
import News from './News'

const { Title } = Typography

const HomePage = () => {
    const { data: cryptosList, isFetching } = useGetCryptosQuery(10)
    const [cryptos, setCryptos] = useState(null)
    const [stats, setStats] = useState(null)

    useEffect(() => {
        setCryptos(cryptosList?.data?.coins)
        setStats(cryptosList?.data?.stats)
    }, [cryptosList, cryptos, stats])

    return (
        <>
            <Title level={2} className='heading'>
                Global Crypto Stats
            </Title>
            <Row>
                <Col span={12}>
                    <Statistic
                        title='Total Cryptocurrencies'
                        value={stats && millify(stats.total)}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title='Total Exchanges'
                        value={stats && millify(stats.totalExchanges)}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title='Total Market Cap'
                        value={stats && millify(stats.totalMarketCap)}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title='Total 24h Volume'
                        value={stats && millify(stats.total24hVolume)}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title='Total Markets'
                        value={stats && millify(stats.totalMarkets)}
                    />
                </Col>
            </Row>
            <div className='home-heading-container'>
                <Title level={2} className='home-title'>
                    Top 10 Crypto in the world
                </Title>
                <Title level={3} className='show-more'>
                    <Link to='/cryptocurrencies'>Show more</Link>
                </Title>
            </div>
            <Cryptocurrencies simplified></Cryptocurrencies>
            <div className='home-heading-container'>
                <Title level={2} className='home-title'>
                    Latest Crypto News
                </Title>
                <Title level={3} className='show-more'>
                    <Link to='/news'>Show more</Link>
                </Title>
            </div>
            <News simplified></News>
        </>
    )
}

export default HomePage
