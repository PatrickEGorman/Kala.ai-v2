import Link from "next/link";
import useRequest from "../../../../hooks/use-request";

const StepsList = ({steps}) => {
    const stepList = steps.map(step => {
        const deleteRequest = useRequest({
            url: `/api/products/steps/${step.id}`,
            method: "delete",
            onSuccess: () => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        let material = "No material";
        let machine = "No machine";
        let quantity = "N/A";

        if (step.machine !== undefined) {
            machine = <Link href={`/services/machines/[machineId]`}
                            as={`/services/machines/${step.machine.id}`}>
                {step.machine.name}</Link>;
        }
        if (step.material !== undefined) {
            material = <Link href={`/services/materials/[materialId]`}
                             as={`/services/materials/${step.material.id}`}>
                {step.material.name}</Link>;
            quantity = step.quantity;
        }
        return (
            <tr key={step.id}>
                <td>{step.name}</td>
                <td>{machine}</td>
                <td>{material}</td>
                <td>
                    {quantity}
                </td>
                <td>
                    {step.stepTime}
                </td>
                <td>
                    <Link href={`/services/products/steps/[stepId]`}
                          as={`/services/products/steps/${step.id}`}>
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
            <h1>Steps</h1>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Machine</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Time</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {stepList}
                </tbody>
            </table>
        </div>
    );
};

StepsList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/products/steps/");
    return {steps: data};
};

export default StepsList;