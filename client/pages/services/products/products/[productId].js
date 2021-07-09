import Router from "next/router";
import useRequest from "../../../../hooks/use-request";
import {useState} from "react";
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

const productShow = ({product}) => {
    const [value, setValue] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/products/products/${product.id}`,
        method: "post",
        body: {
            value
        },
        onSuccess: () => location.reload()
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(value);

        if (isNaN(value)) {
            setValue("");
            return;
        }

        setValue(value.toFixed(2));
    };

    const deleteRequest = useRequest({
        url: `/api/products/products/${product.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/products/productslist")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };
    let i = 0;
    const steps = product.steps.map(step => {
            i++;
            let machine;
            step.machine !== undefined ? machine = step.machine.name : machine = "None";
            let material;
            step.material !== undefined ? material = step.material.name : material = "None";
            let quantity;
            step.material !== undefined ? quantity = step.quantity : quantity = "N/A";
            return <Row key={i}><Col>
                <h2>Step {i}: <Link href={`/services/products/steps/[stepId]`}
                                    as={`/services/products/steps/${step.id}`}>
                    {step.name}
                </Link></h2>
                <div className={"alert alert-secondary"}>
                    <h3>Step Details</h3>
                    <ul>
                        <li>Machine: {machine}</li>
                        <li>Material: {material}</li>
                        <li>Quantity: {quantity}</li>
                        <li>Time: {step.stepTime}</li>
                    </ul>
                </div>
            </Col>
            </Row>;
        }
    );
    ;

    return <Row>
        <Col>
            <h1>View Product</h1>
            <h2>Name: {product.name}</h2>
            <h2>Value: {product.value}</h2>
            <h2>SKU: {product.SKU}</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Edit Value</label>
                    <input
                        value={value}
                        onBlur={onBlur}
                        onChange={e => setValue(e.target.value)}
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
        <Col>
            {steps}
        </Col>
    </Row>;
};
;

productShow.getInitialProps = async (context, client) => {
    const {productId} = context.query;
    const {data} = await client.get(`/api/products/products/${productId}`);

    return {product: data, title: `View Product: ${data.name}`};
}
;

export default productShow;