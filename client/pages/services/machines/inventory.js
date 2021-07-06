import Link from "next/link";
import useRequest from "../../../hooks/use-request";

const MachinesList = ({invMachines}) => {
    const invMachineList = invMachines.map(invMachine => {
        const deleteRequest = useRequest({
            url: `/api/machines/inventory/${invMachine.id}`,
            method: "delete",
            onSuccess: () => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={invMachine.machine.id}>
                <td><Link href={`/services/machines/[machineId]`} as={`/services/machines/${invMachine.machine.id}`}>
                    {invMachine.machine.name}</Link></td>
                <td><Link href={`/services/materials/[materialId]`}
                          as={`/services/materials/${invMachine.material.id}`}>
                    {invMachine.material.name}</Link></td>
                <td><Link href={`/services/factories/[factoryId]`} as={`/services/factories/${invMachine.factory.id}`}>
                    {invMachine.factory.name}</Link></td>
                <td>
                    <Link href={`/services/machines/inventory/[inventoryId]`}
                          as={`/services/machines/inventory/${invMachine.id}`}>
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
                    <th>Machine</th>
                    <th>Material</th>
                    <th>Factory</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {invMachineList}
                </tbody>
            </table>
        </div>
    );
};

MachinesList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/machines/inventory/");
    return {invMachines: data};
};

export default MachinesList;