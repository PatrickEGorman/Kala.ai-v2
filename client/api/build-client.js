import axios from "axios";

const buildClient = ({req}) => {
    if (typeof window === "undefined") {

        return axios.create({
            baseURL: process.env.REQUEST_URL,
            headers: req.headers
        });
    } else {
        return axios.create();
    }
};

export default buildClient;