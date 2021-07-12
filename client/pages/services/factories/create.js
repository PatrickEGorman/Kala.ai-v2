import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import FactoriesList from "./list";

const CreateFactory = ({}) => {
    const [name, setName] = useState("");
    const [maintenanceTime, setMaintenanceTime] = useState("");
    const [cost, setCost] = useState("");
    const [maintenanceCost, setMaintenanceCost] = useState("");
    const [storage, setStorage] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/factories/",
        method: "post",
        body: {
            name,
            maintenanceTime,
            cost,
            maintenanceCost,
            storage,
            lat,
            long
        },
        onSuccess: (factory) => Router.push("/services/factories/[factoryId]", `/services/factories/${factory.id}`)
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
        if (isNaN(cost)) {
            setCost("");
            return;
        }
        if (isNaN(storage)) {
            setStorage("");
            return;
        }
        if (isNaN(maintenanceCost)) {
            setMaintenanceCost("");
            return;
        }
        if (isNaN(lat)) {
            setLat("");
            return;
        }
        if (isNaN(long)) {
            setLong("");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Create Factory</h1>
            <div className="form-group">
                <label>Factory Name</label>
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

            <div className="form-group">
                <label>Latitude</label>
                <input
                    value={lat}
                    onBlur={onBlur}
                    onChange={e => setLat(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Longitude</label>
                <input
                    value={long}
                    onBlur={onBlur}
                    onChange={e => setLong(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Create</button>
        </form>
    );
};

FactoriesList.getInitialProps = async (context, client) => {
    return {title: `Create Factory`};
};

export default CreateFactory;