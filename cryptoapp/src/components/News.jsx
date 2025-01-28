import React from 'react'

import { Select, Typography, Row, Col, Card, Avatar } from 'antd'
import moment from 'moment/moment'

import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi'
import { useGetCryptosQuery } from '../services/cryptoApi'

const { Text, Title } = Typography
const { Option } = Select

const News = ({ simplified }) => {
    const { data: cryptoNews } = useGetCryptoNewsQuery()
    const { data } = useGetCryptosQuery(100)
    console.log('cryptoNews')
    console.log(cryptoNews?.data)
    if (!cryptoNews?.data) return 'Loading...'

    return (
        <div>
            <Row gutter={[24, 24]}>
                {cryptoNews.data.map((news, i) => (
                    <Col xs={24} sm={12} lg={8} key={i}>
                        <Card hoverable className='news-card'>
                            <a href={news.url} target='_blank' rel='noreferrer'>
                                <div className='news-image-container'>
                                    <Title className='news-title' level={4}>
                                        {news.title}
                                    </Title>
                                    <img
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '100px',
                                        }}
                                        src={news.thumbnail}
                                        alt='news'
                                    ></img>
                                </div>
                                <p>
                                    {news.description > 100
                                        ? `${news.description.substring(
                                              0,
                                              100
                                          )}...`
                                        : news.description}
                                </p>
                                <div className='provider-container'>
                                    <div>
                                        <Avatar
                                            src={news.thumbnail}
                                            alt='news'
                                        ></Avatar>
                                        <Text>{news.title}</Text>
                                    </div>
                                    <Text className='provider-time'>
                                        {moment(news.createdAt)
                                            .startOf('ss')
                                            .fromNow()}
                                    </Text>
                                </div>
                            </a>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default News
