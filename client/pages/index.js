import buildClient from "../api/build-client";

const LandingPage = ({}) => {
    return <h1>Welcome</h1>;
};

// LandingPage.getInitialProps = async context => {
//     const {data} = await buildClient(context).get("/api/users/currentuser");
//     return data;
// };

export default LandingPage;