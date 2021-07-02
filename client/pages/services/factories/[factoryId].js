import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import {useState} from "react";
import Link from "next/link";

const factoryShow = ({factory}) => {

    const [maintenanceTime, setMaintenanceTime] = useState("");
    const [cost, setCost] = useState("");
    const [maintenanceCost, setMaintenanceCost] = useState("");
    const [storage, setStorage] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/factories/${factory.id}`,
        method: "post",
        body: {
            maintenanceTime,
            cost,
            maintenanceCost,
            storage
        },
        onSuccess: (factory) => location.reload()
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const onBlur = () => {
        if (isNaN(maintenanceTime)) {
            setMaintenanceTime("");
            return;
        }
        if (isNaN(storage)) {
            setStorage("");
            return;
        }
        if (isNaN(cost)) {
            setCost("");
            return;
        }
        if (isNaN(maintenanceCost)) {
            setMaintenanceCost("");
        }
    };

    const deleteRequest = useRequest({
        url: `/api/factories/${factory.id}`,
        method: "delete",
        onSuccess: (factory) => Router.push("/services/factories/list")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };


    return <div>
        <h1>View Factory</h1>
        <h1>Name: {factory.name}</h1>
        <h2>Value: {factory.cost}</h2>
        <h2>Storage Capacity: {factory.storage}</h2>
        <h2>Running Time: {factory.uptime}</h2>
        <h2>Maintenance Time: {factory.maintenanceTime}</h2>
        <h2>Maintenance Cost: {factory.maintenanceCost}</h2>
        <h2>Latitude: {factory.location.lat}</h2>
        <h2>Longitude: {factory.location.long}</h2>
        <br/>
        <form onSubmit={onSubmit}>
            <h1>Edit Factory</h1>
            <div className="form-group">
                <label>Value</label>
                <input
                    value={cost}
                    onBlur={onBlur}
                    onChange={e => setCost(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Maintenance Time</label>
                <input
                    value={maintenanceTime}
                    onBlur={onBlur}
                    onChange={e => setMaintenanceTime(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Maintenance Cost</label>
                <input
                    value={maintenanceCost}
                    onBlur={onBlur}
                    onChange={e => setMaintenanceCost(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Storage Capacity</label>
                <input
                    value={storage}
                    onBlur={onBlur}
                    onChange={e => setStorage(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Edit</button>
        </form>
        <br/>
        <form onSubmit={onDeleteSubmit}>
            <button className="btn btn-danger">Delete</button>
        </form>
    </div>;
};

factoryShow.getInitialProps = async (context, client) => {
    const {factoryId} = context.query;
    const factoryData = await client.get(`/api/factories/${factoryId}`);
    const materialsData = await client.get(`/api/materials/`);
    return {factory: factoryData.data, materials: materialsData.data};
};

export default factoryShow;