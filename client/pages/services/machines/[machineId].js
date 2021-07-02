import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import {useState} from "react";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

const machineShow = ({machine}) => {

    const [maintenanceTime, setMaintenanceTime] = useState("");
    const [errorRate, setErrorRate] = useState("");
    const [initialCost, setInitialCost] = useState("");
    const [maintenanceCost, setMaintenanceCost] = useState("");
    const [operationCost, setOperationCost] = useState("");
    const [laborCost, setLaborCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/machines/catalog.${machine.id}`,
        method: "post",
        body: {
            maintenanceTime,
            errorRate,
            initialCost,
            maintenanceCost,
            operationCost,
            laborCost
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
        if (isNaN(errorRate)) {
            setErrorRate("");
            return;
        }
        if (isNaN(initialCost)) {
            setInitialCost("");
            return;
        }
        if (isNaN(maintenanceCost)) {
            setMaintenanceCost("");
            return;
        }
        if (isNaN(operationCost)) {
            setOperationCost("");
            return;
        }
        if (isNaN(laborCost)) {
            setLaborCost("");
        }
    };

    const deleteRequest = useRequest({
        url: `/api/machines/catalog/${machine.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/machines/list")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };


    return <Row>
        <Col>
            <h1>View Catalog Machine</h1>
            <h1>Name: {machine.name}</h1>
            <h2>Material:
                <Link href={`/services/materials/[materialId]`} as={`/services/materials/${machine.material.id}`}>
                    <a>{machine.material.name}</a>
                </Link>
            </h2>
            <h2>Inital Cost: {machine.initialCost}</h2>
            <h2>Error Rate: {machine.errorRate}</h2>
            <h2>Maintenance Time: {machine.maintenanceTime}</h2>
            <h2>Maintenance Cost: {machine.maintenanceCost}</h2>
            <h2>Operation Cost: {machine.operationCost}</h2>
            <h2>Labor Cost: {machine.laborCost}</h2>
        </Col>
        <Col>
            <form onSubmit={onSubmit}>
                <h1>Edit Machine</h1>
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
                    <label>Error Rate</label>
                    <input
                        value={errorRate}
                        onBlur={onBlur}
                        onChange={e => setErrorRate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Initial Cost</label>
                    <input
                        value={initialCost}
                        onBlur={onBlur}
                        onChange={e => setInitialCost(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Operation Cost</label>
                    <input
                        value={operationCost}
                        onBlur={onBlur}
                        onChange={e => setOperationCost(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Labor Cost</label>
                    <input
                        value={laborCost}
                        onBlur={onBlur}
                        onChange={e => setLaborCost(e.target.value)}
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
        </Col>
    </Row>;
};

machineShow.getInitialProps = async (context, client) => {
    const {machineId} = context.query;
    const machineData = await client.get(`/api/machines/catalog/${machineId}`);
    const materialsData = await client.get(`/api/materials/`);
    return {machine: machineData.data, materials: materialsData.data};
};

export default machineShow;