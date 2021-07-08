import Router from "next/router";
import useRequest from "../../../../hooks/use-request";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

const machineShow = ({step}) => {

    const deleteRequest = useRequest({
        url: `/api/products/steps/${step.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/products/steps/")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };

    let machine;
    if (step.machine != null) {
        machine = <h2>Machine:
            <Link href={`/services/products/steps/[machineId]`}
                  as={`/services/products/steps/${step.machine.id}`}>
                {step.machine.name}
            </Link>
        </h2>;
    }
    let material, quantity;
    if (step.material != null) {
        material = <h2>Material:
            <Link href={`/services/materials/[materialId]`} as={`/services/materials/${step.material.id}`}>
                {step.material.name}
            </Link>
        </h2>;
        quantity = <h2>Quantity: {step.quantity}</h2>;
    }

    return <div>
        <Row className={"align-content-center"}><h1>View Step</h1></Row>
        <Row>
            <Col>
                <h2>Name: {step.name}</h2>
                {machine}
                {material}
                {quantity}
                <h2>Step Time: {step.stepTime}</h2>
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
    const {stepId} = context.query;
    const {data} = await client.get(`/api/products/steps/${stepId}`);
    return {step: data};
};

export default machineShow;