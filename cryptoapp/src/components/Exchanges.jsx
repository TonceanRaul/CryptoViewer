import React from 'react'
import millify from 'millify'
import { Collapse, Row, Col, Typography, Avatar } from 'antd'
import HTMLReactParser from 'html-react-parser'

import { useGetCryptosQuery, useGetExchangesQuery } from '../services/cryptoApi'

const { Text } = Typography
const { Panel } = Collapse

const Exchanges = () => {
    //const { data, isFetching } = useGetExchangesQuery()
    const { data, isFetching } = useGetCryptosQuery(57)
    const exchangesList = data?.data?.coins
    // Note: To access this endpoint you need premium plan
    if (isFetching) return '<Loader />'
    const volume = '24hVolume'
    console.log(exchangesList)
    return (
        <>
            <Row>
                <Col span={6}>Exchanges</Col>
                <Col span={6}>24h Trade Volume</Col>
                <Col span={6}>Market Cap</Col>
                <Col span={6}>Change</Col>
            </Row>
            <Row>
                {exchangesList?.map((exchange) => (
                    <Col span={24}>
                        <Collapse>
                            <Panel
                                key={exchange.uuid}
                                showArrow={false}
                                header={
                                    <Row key={exchange.uuid}>
                                        <Col span={6}>
                                            <Text>
                                                <strong>
                                                    {exchange.rank}.
                                                </strong>
                                            </Text>
                                            <Avatar
                                                className='exchange-image'
                                                src={exchange.iconUrl}
                                            />
                                            <Text>
                                                <strong>{exchange.name}</strong>
                                            </Text>
                                        </Col>
                                        <Col span={6}>
                                            ${millify(exchange[volume])}
                                        </Col>
                                        <Col span={6}>
                                            {millify(exchange.marketCap)}
                                        </Col>
                                        <Col
                                            span={6}
                                            style={{
                                                color:
                                                    exchange.change > 0
                                                        ? '#006400'
                                                        : '#FF0000',
                                            }}
                                        >
                                            {millify(exchange.change)}%
                                        </Col>
                                    </Row>
                                }
                            >
                                {HTMLReactParser(exchange.symbol || '')}
                            </Panel>
                        </Collapse>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default Exchanges
