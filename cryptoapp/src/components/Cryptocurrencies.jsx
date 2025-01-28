import React, { useEffect, useState } from 'react'
import millify from 'millify'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input } from 'antd'

import { useGetCryptosQuery } from '../services/cryptoApi'

const Cryptocurrencies = ({ simplified }) => {
    const count = simplified ? 10 : 120
    const { data: cryptosList, isFetching } = useGetCryptosQuery(count)
    const [cryptos, setCryptos] = useState([])
    const [stats, setStats] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        setStats(cryptosList?.data?.stats)
        const filteredData = cryptosList?.data?.coins.filter((coin) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setCryptos(filteredData)
    }, [cryptosList, stats, searchTerm])
    console.log(cryptosList)
    return (
        <>
            {!simplified && (
                <div className='search-crypto'>
                    <Input
                        placeholder='Search Cryptocurrency'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></Input>
                </div>
            )}
            <Row gutter={[18, 18]} className='crypto-card-container'>
                {cryptos?.map((currency) => (
                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                        className='crypto-card'
                        key={currency.uuid}
                    >
                        <Link to={`/coin/${currency.uuid}`}>
                            <Card
                                title={`${currency.rank}. ${currency.name}`}
                                extra={
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <img
                                        className='crypto-image'
                                        src={currency.iconUrl}
                                    ></img>
                                }
                                hoverable
                            >
                                <p>Price: {millify(currency.price)}</p>
                                <p>Market Cap: {millify(currency.marketCap)}</p>
                                <p>Daily Change: {millify(currency.change)}%</p>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default Cryptocurrencies
