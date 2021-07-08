import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../../hooks/use-request";

const CreateMachine = ({machines, materials}) => {
    const [name, setName] = useState("");
    const [machine, setMachine] = useState("");
    const [material, setMaterial] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stepTime, setStepTime] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/products/steps",
        method: "post",
        body: {
            name,
            machine,
            material,
            quantity,
            stepTime
        },
        onSuccess: (step) => Router.push("/services/products/steps/[stepId]",
            `/services/products/steps/${step.id}`)
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const machinesList = machines.map((m) => {
        return <option key={m.id} value={m.id}>
            Machine: {m.name} Material: {m.material.name}
        </option>;
    });
    const materialsList = materials.map((m) => {
        return <option key={m.id} value={m.id}>
            Material: {m.name}
        </option>;
    });

    const onBlur = () => {
        // machines.map(m => {
        //     m.id === machine ? setMaterial(m.material.id) : {};
        // });
        if (isNaN(parseFloat(quantity))) {
            setQuantity("");
            return;
        }
        if (isNaN(parseFloat(stepTime))) {
            setStepTime("");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Create Step</h1>
            <div className={"form-group"}>
                <label>Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Machine/Material/Machine Cost</label>
                <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                        onChange={e => {
                            setMachine(e.target.value);
                        }}
                        onBlur={onBlur}>
                    <option value={""}>Machine</option>
                    {machinesList}
                </select>
            </div>
            <div className="form-group">
                <labe>Material</labe>
                <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                        onChange={e => {
                            setMaterial(e.target.value);
                        }}
                        onBlur={onBlur}>
                    <option value={""}>Material</option>
                    {materialsList}
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
            <div className={"form-group"}>
                <label>Step Time</label>
                <input
                    value={stepTime}
                    onBlur={onBlur}
                    onChange={e => setStepTime(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Create</button>
        </form>
    );
};

CreateMachine.getInitialProps = async (context, client) => {
    const machinesData = await client.get("/api/machines/catalog/");
    const materialsData = await client.get("/api/materials/catalog/");
    return {machines: machinesData.data, materials: materialsData.data};
};

export default CreateMachine;