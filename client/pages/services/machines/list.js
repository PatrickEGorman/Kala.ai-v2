import Link from "next/link";
import useRequest from "../../../hooks/use-request";

const MachinesList = ({machines}) => {
    const machineList = machines.map(machine => {
        const deleteRequest = useRequest({
            url: `/api/machines/catalog/${machine.id}`,
            method: "delete",
            onSuccess: (machine) => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={machine.id}>
                <td>{machine.name}</td>
                <td>{machine.material.name}</td>
                <td>{machine.initialCost}</td>
                <td>
                    <Link href={`/services/machines/[machineId]`} as={`/services/machines/${machine.id}`}>
                        <a className={"btn btn-primary btn-sm"}>View</a>
                    </Link>
                </td>
                <td>
                    <button onClick={onDeleteSubmit} className="btn btn-sm btn-danger">Delete</button>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Machines</h1>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Material</th>
                    <th>Initial Cost</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {machineList}
                </tbody>
            </table>
        </div>
    );
};

MachinesList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/machines/catalog/");
    return {machines: data, title: "Machines Catalog"};
};

export default MachinesList;