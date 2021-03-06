import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import buildClient from "../api/build-client";
import Header from "../components/header";
import {Container} from "react-bootstrap";

const AppComponent = ({Component, pageProps}) => {
    const title = pageProps.title || undefined;
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>{title || "Kala.ai V2"}</title>
            </Head>
            <Header/>
            <Container>
                <Component {...pageProps}/>
            </Container>
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