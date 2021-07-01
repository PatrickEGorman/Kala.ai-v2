import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({Component, pageProps}) => {
    return <div>
        <Header/>
        <div className={"container"}>
            <Component {...pageProps}/>
        </div>
    </div>;
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