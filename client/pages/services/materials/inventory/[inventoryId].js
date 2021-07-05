import Router from "next/router";
import useRequest from "../../../../hooks/use-request";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";
import {useState} from "react";

const materialShow = ({invMaterial}) => {
    const [quantity, setQuantity] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/materials/inventory/${invMaterial.id}`,
        method: "post",
        body: {
            quantity
        },
        onSuccess: () => location.reload()
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(quantity);

        if (isNaN(value)) {
            setQuantity("");
        }
    };

    const deleteRequest = useRequest({
        url: `/api/materials/inventory/${invMaterial.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/materials/inventory")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };


    return <div>
        <Row className={"align-content-center"}><h1>View Material in Inventory</h1></Row>
        <Row>
            <Col>
                <h2>Factory name:
                    <Link href={`/services/factories/[factoryId]`} as={`/services/factories/${invMaterial.factory.id}`}>
                        {invMaterial.factory.name}
                    </Link>
                </h2>
                <h2>Material:
                    <Link href={`/services/materials/[materialId]`}
                          as={`/services/materials/${invMaterial.material.id}`}>
                        {invMaterial.material.name}
                    </Link>
                </h2>
                <h2>Quantity:
                    {invMaterial.quantity}
                </h2>
            </Col>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Edit Quantity</label>
                    <input
                        value={quantity}
                        onBlur={onBlur}
                        onChange={e => setQuantity(e.target.value)}
                        className="form-control"
                    />
                </div>
                {errors}
                <br/>
                <button className="btn btn-primary">Edit</button>
            </form>
            <col/>
        </Row>
        <Row className={"align-content-center"}>
            <form onSubmit={onDeleteSubmit}>
                <button className="btn btn-danger">Delete</button>
            </form>
        </Row>
    </div>;
};

materialShow.getInitialProps = async (context, client) => {
    const {inventoryId} = context.query;
    const {data} = await client.get(`/api/materials/inventory/${inventoryId}`);
    return {invMaterial: data};
};

export default materialShow;