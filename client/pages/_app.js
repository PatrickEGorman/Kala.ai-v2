import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({Component, pageProps}) => {
    return <div>
        <Header/>
        <Component {...pageProps}/>;
    </div>;
};

AppComponent.getInitialProps = async appContext => {
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
        pageProps
    };
};

export default AppComponent;