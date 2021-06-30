import {useState, useEffect} from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/materials/",
        method: "post",
        body: {
            name: name,
            cost: cost
        },
        onSuccess: () => Router.push("/")
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Material Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};
