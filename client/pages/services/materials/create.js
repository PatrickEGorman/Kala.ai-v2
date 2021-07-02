import {useState, useEffect} from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";

export default () => {
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/materials/",
        method: "post",
        body: {
            name,
            cost
        },
        onSuccess: (material) => Router.push("/services/materials/[materialId]", `/services/materials/${material.id}`)
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(cost);

        if (isNaN(value)) {
            setCost("");
            return;
        }

        setCost(value.toFixed(2));
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Create Material</h1>
            <div className="form-group">
                <label>Material Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Cost</label>
                <input
                    value={cost}
                    onBlur={onBlur}
                    onChange={e => setCost(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Create</button>
        </form>
    );
};
