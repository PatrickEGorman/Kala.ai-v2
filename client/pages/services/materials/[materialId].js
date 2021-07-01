import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import {useState} from "react";

const materialShow = ({material}) => {
    const [cost, setCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/materials/${material.id}`,
        method: "post",
        body: {
            cost
        },
        onSuccess: (material) => location.reload()
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

    const deleteRequest = useRequest({
        url: `/api/materials/${material.id}`,
        method: "delete",
        onSuccess: (material) => Router.push("/services/materials/list")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };

    return <div>
        <h1>View Material</h1>
        <h2>Name: {material.name}</h2>
        <h2>Cost: {material.cost}</h2>
        <br/>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Edit Cost</label>
                <input
                    value={cost}
                    onBlur={onBlur}
                    onChange={e => setCost(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <br/>
            <button className="btn btn-primary">Edit</button>
        </form>
        <br/>
        <form onSubmit={onDeleteSubmit}>
            <button className="btn btn-danger">Delete</button>
        </form>
    </div>;
};

materialShow.getInitialProps = async (context, client) => {
    const {materialId} = context.query;
    const {data} = await client.get(`/api/materials/${materialId}`);

    return {material: data};
};

export default materialShow;