import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";

const CreateMaterial = ({materials, factories}) => {
    const [material, setMaterial] = useState("");
    const [factory, setFactory] = useState("");
    const [quantity, setQuantity] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/materials/inventory",
        method: "post",
        body: {
            material,
            factory,
            quantity
        },
        onSuccess: (material) => Router.push("/services/materials/inventory/[materialId]",
            `/services/materials/inventory/${material.id}`)
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

    const materialsList = materials.map((m) => {
        return <option key={m.id} value={m.id}>
            Material: {m.name} Cost: {m.cost}
        </option>;
    });
    const factoriesList = factories.map((f) => {
        return <option key={f.id} value={f.id}>
            Factory: {f.name}
        </option>;
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>Purchase Material</h1>
            <div className="form-group">
                <label>Material/Cost</label>
                <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                        onChange={e => {
                            setMaterial(e.target.value);
                        }}>
                    <option value={""}>Material</option>
                    {materialsList}
                </select>
            </div>
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
            {errors}
            <button className="btn btn-primary">Buy</button>
        </form>
    );
};

CreateMaterial.getInitialProps = async (context, client) => {
    const materialsData = await client.get("/api/materials/catalog/");
    const factoriesData = await client.get("/api/factories/");
    return {materials: materialsData.data, factories: factoriesData.data};
};

export default CreateMaterial;