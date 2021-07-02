import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";

const CreateMachine = ({machines, factories}) => {
    const [machine, setMachine] = useState("");
    const [factory, setFactory] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/machines/inventory",
        method: "post",
        body: {
            machine,
            factory
        },
        onSuccess: (machine) => Router.push("/services/machines/inventory")
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
    const factoriesList = factories.map((f) => {
        return <option key={f.id} value={f.id}>
            Factory: {f.name}
        </option>;
    });

    return (
        <form onSubmit={onSubmit}>
            <h1>Purchase Machine</h1>
            <div className="form-group">
                <label>Machine/Material</label>
                <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                        onChange={e => {
                            setMachine(e.target.value);
                        }}>
                    <option value={""}>Machine</option>
                    {machinesList}
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
            {errors}
            <button className="btn btn-primary">Create</button>
        </form>
    );
};

CreateMachine.getInitialProps = async (context, client) => {
    const machinesData = await client.get("/api/machines/catalog/");
    const factoriesData = await client.get("/api/factories/");
    return {machines: machinesData.data, factories: factoriesData.data};
};

export default CreateMachine;