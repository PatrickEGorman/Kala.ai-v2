import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import buildClient from "../api/build-client";
import Header from "../components/header";
import {Col, Container, Row} from "react-bootstrap";

const AppComponent = ({Component, pageProps}) => {
    const title = pageProps.title || undefined;
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>{title || "Kala.ai V2"}</title>
            </Head>
            <Row className={"h-100"}>
                <Col md={2}>
                    <Header/>
                </Col>
                <Col md={9}>
                    <div className={"mr-3"}>
                        <Component {...pageProps}/>
                    </div>
                </Col>
            </Row>
        </>);
};

AppComponent.getInitialProps = async appContext => {
    let pageProps = {};
    const client = buildClient(appContext.ctx);
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client);
    }
    return {
        pageProps
    };
};

export default AppComponent;