import {useState} from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";

const CreateMachine = ({materials}) => {
    const [name, setName] = useState("");
    const [maintenanceTime, setMaintenanceTime] = useState("");
    const [material, setMaterial] = useState("");
    const [errorRate, setErrorRate] = useState("");
    const [initialCost, setInitialCost] = useState("");
    const [maintenanceCost, setMaintenanceCost] = useState("");
    const [operationCost, setOperationCost] = useState("");
    const [laborCost, setLaborCost] = useState("");
    const {doRequest, errors} = useRequest({
        url: "/api/machines/catalog",
        method: "post",
        body: {
            name,
            maintenanceTime,
            material,
            errorRate,
            initialCost,
            maintenanceCost,
            operationCost,
            laborCost
        },
        onSuccess: (machine) => Router.push("/services/machines/[machineId]", `/services/machines/${machine.id}`)
    });

    const onSubmit = async event => {
        event.preventDefault();

        await doRequest();
    };

    const materialList = materials.map((m) => {
        return <option key={m.id} value={m.id}>
            {m.name}
        </option>;
    });

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

    return (
        <form onSubmit={onSubmit}>
            <h1>Create Machine</h1>
            <div className="form-group">
                <label>Machine Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className={"form-gropu"}>
                <select className={"form-select form-select-lg mb-3"} aria-label={".form-select-lg"}
                        onChange={e => {
                            setMaterial(e.target.value);
                        }}>
                    <option value={""}>Material</option>
                    {materialList}
                </select>
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
            <button className="btn btn-primary">Create</button>
        </form>
    );
};

CreateMachine.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/materials/");
    return {materials: data};
};

export default CreateMachine;