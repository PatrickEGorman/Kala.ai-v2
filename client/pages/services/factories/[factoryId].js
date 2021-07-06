import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import {useState} from "react";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

const factoryShow = ({factory}) => {

    const materialsList = factory.materials.map(invMaterial => {
        return <Row>
            <h3>
                Name:
                <Link href={`/services/materials/inventory/[materialId]`}
                      as={`/services/materials/inventory/${invMaterial.material.id}`}>
                    {invMaterial.material.name}
                </Link>
            </h3>
            <h3>Quantity: {invMaterial.quantity}</h3>
        </Row>;
    });

    const machinesList = factory.machines.map(invMachine => {
        return <Row>
            <h3>
                Name:
                <Link href={`/services/machines/inventory/[machineId]`}
                      as={`/services/machines/inventory/${invMachine.machine.id}`}>
                    {invMachine.machine.name}
                </Link>
            </h3>
            <h3>
                Material:
                <Link href={`/services/materials/[materialId]`}
                      as={`/services/materials/${invMachine.machine.material.id}`}>
                    {invMachine.machine.material.name}
                </Link>
            </h3>
        </Row>;
    });
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
        onSuccess: () => location.reload()
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
        onSuccess: () => Router.push("/services/factories/list")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };


    return <>
        <Row>
            <Col>
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
            </Col>
            <Col>
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
            </Col>
        </Row>
        <Row>
            <Col>
                <h2>Materials</h2>
                {materialsList}
            </Col>
            <Col>
                <h2>Machines</h2>
                {machinesList}
            </Col>
        </Row>
    </>;
};

factoryShow.getInitialProps = async (context, client) => {
    const {factoryId} = context.query;
    const {data} = await client.get(`/api/factories/${factoryId}`);
    console.log(data.machines);
    return {factory: data};
};

export default factoryShow;