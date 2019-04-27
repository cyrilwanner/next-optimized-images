import React from 'react'
import App, { Container } from 'next/app'
import Header from '../components/Header';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <div className="container">
        <Header />
          <Component {...pageProps} />
        </div>

        <style jsx>{`
          .container {
            width: 600px;
            margin: auto;
          }
        `}</style>
      </Container>
    )
  }
}
