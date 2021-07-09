import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import {useState} from "react";
import {Col, Row} from "react-bootstrap";

const materialShow = ({material, factories}) => {
    const [cost, setCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: `/api/materials/catalog/${material.id}`,
        method: "post",
        body: {
            cost
        },
        onSuccess: () => location.reload()
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
        url: `/api/materials/catalog/${material.id}`,
        method: "delete",
        onSuccess: () => Router.push("/services/materials/list")
    });

    const onDeleteSubmit = async event => {
        event.preventDefault();

        await deleteRequest.doRequest();
    };

    const [factory, setFactory] = useState("");
    const [quantity, setQuantity] = useState("");

    const [purchErr, setPurchErr] = useState("");

    const purchaseRequest = useRequest({
        url: "/api/materials/inventory",
        method: "post",
        body: {
            material: material.id,
            factory,
            quantity
        },
        onSuccess: (material) => Router.push("/services/materials/inventory/[materialId]",
            `/services/materials/inventory/${material.id}`)
    });

    const onPurchaseSubmit = async event => {
        event.preventDefault();

        await purchaseRequest.doRequest();
        setPurchErr(purchaseRequest.errors);
    };

    const factoriesList = factories.map((f) => {
        return <option key={f.id} value={f.id}>
            Factory: {f.name}
        </option>;
    });

    return <Row>
        <Col>
            <div>
                <h1>View Material</h1>
                <h1>Name: {material.name}</h1>
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
            </div>
        </Col>
        <Col>
            <form onSubmit={onPurchaseSubmit}>
                <h1>Purchase Material</h1>
                <div className="form-group">
                    <labe>Factory</labe>
                    <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                            onChange={e => {
                                setFactory(e.target.value);
                            }}>
                        <option value={""}>Factory</option>
                        {factoriesList}
                    </select>
                </div>
                <div className={"form-group"}>
                    <label>Quantity</label>
                    <input
                        value={quantity}
                        onBlur={onBlur}
                        onChange={e => setQuantity(e.target.value)}
                        className="form-control"
                    />
                </div>
                {purchErr}
                <button className="btn btn-primary">Buy</button>
            </form>
        </Col>
    </Row>;
};

materialShow.getInitialProps = async (context, client) => {
    const {materialId} = context.query;
    const {data} = await client.get(`/api/materials/catalog/${materialId}`);
    const factoriesData = (await client.get("/api/factories/")).data;

    return {material: data, factories: factoriesData};
};

export default materialShow;