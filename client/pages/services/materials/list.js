import buildClient from "../../../api/build-client";

const MaterialsList = ({}) => {
    return <h1>Welcome</h1>;
};

MaterialsList.getInitialProps = async context => {
    const {data} = await buildClient(context).get("/api/materials/");
    return data;
};

export default MaterialsList;