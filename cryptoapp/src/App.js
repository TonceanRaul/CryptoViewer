import React from 'react'

import { Routes, Route, Link } from 'react-router-dom'
import { Layout, Typography, Space } from 'antd'

import {
    Navbar,
    Exchanges,
    HomePage,
    Cryptocurrencies,
    News,
    CryptoDetails,
} from './components'
import './App.css'

const App = () => {
    return (
        <div className='app'>
            <div className='navbar'>
                <Navbar></Navbar>
            </div>
            <div className='main'>
                <Layout>
                    <div className='routes'>
                        <Routes>
                            <Route
                                exact
                                path='/'
                                element={<HomePage />}
                            ></Route>
                            <Route
                                exact
                                path='/exchanges'
                                element={<Exchanges></Exchanges>}
                            ></Route>
                            <Route
                                exact
                                path='/cryptocurrencies'
                                element={<Cryptocurrencies></Cryptocurrencies>}
                            ></Route>
                            <Route
                                exact
                                path='/coin/:coinId'
                                element={<CryptoDetails></CryptoDetails>}
                            ></Route>
                            <Route
                                exact
                                path='/news'
                                element={<News></News>}
                            ></Route>
                        </Routes>
                    </div>
                </Layout>
                <div className='footer'>
                    <Typography.Title
                        level={5}
                        style={{ color: 'white', textAlign: 'center' }}
                    >
                        Cryptoverse
                        <br />
                        All rights reserved.
                    </Typography.Title>
                    <Space>
                        <Link to='/'>Home</Link>
                        <Link to='/exchanges'>Exchanges</Link>
                        <Link to='/news'>News</Link>
                    </Space>
                </div>
            </div>{' '}
        </div>
    )
}

export default App
