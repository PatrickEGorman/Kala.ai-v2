import Router from "next/router";
import useRequest from "../../../../hooks/use-request";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

const machineShow = ({invMachine}) => {

    const deleteRequest = useRequest({
        url: `/api/machines/inventory/${invMachine.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/machines/inventory")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };


    return <div>
        <Row className={"align-content-center"}><h1>View Machine in Inventory</h1></Row>
        <Row>
            <Col>
                <h2>Factory name:
                    <Link href={`/services/factories/[factoryId]`} as={`/services/factories/${invMachine.factory.id}`}>
                        {invMachine.factory.name}
                    </Link>
                </h2>
                <h2>Machine:
                    <Link href={`/services/machines/[machineId]`} as={`/services/machines/${invMachine.machine.id}`}>
                        {invMachine.machine.name}
                    </Link>
                </h2>
                <h2>Material:
                    <Link href={`/services/materials/[materialId]`}
                          as={`/services/materials/${invMachine.material.id}`}>
                        {invMachine.material.name}
                    </Link>
                </h2>
                <h2>Error Rate: {invMachine.machine.errorRate}</h2>
                <h2>Maintenance Time: {invMachine.machine.maintenanceTime}</h2>
                <h2>Maintenance Cost: {invMachine.machine.maintenanceCost}</h2>
                <h2>Operation Cost: {invMachine.machine.operationCost}</h2>
                <h2>Labor Cost: {invMachine.machine.laborCost}</h2>
            </Col>
        </Row>
        <Row className={"align-content-center"}>
            <form onSubmit={onDeleteSubmit}>
                <button className="btn btn-danger">Delete</button>
            </form>
        </Row>
    </div>;
};

machineShow.getInitialProps = async (context, client) => {
    const {inventoryId} = context.query;
    const {data} = await client.get(`/api/machines/inventory/${inventoryId}`);
    return {invMachine: data, title: `Inventory Machine ${data.name}`};
};

export default machineShow;