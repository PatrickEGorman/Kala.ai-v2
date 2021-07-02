import Link from "next/link";
import useRequest from "../../../hooks/use-request";

const FactoriesList = ({factories}) => {
    const factoryList = factories.map(factory => {
        const deleteRequest = useRequest({
            url: `/api/factories/${factory.id}`,
            method: "delete",
            onSuccess: (factory) => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={factory.id}>
                <td>{factory.name}</td>
                <td>{factory.cost}</td>
                <td>{factory.storage}</td>
                <td>
                    <Link href={`/services/factories/[factoryId]`} as={`/services/factories/${factory.id}`}>
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
            <h1>Factories</h1>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Capacity</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {factoryList}
                </tbody>
            </table>
        </div>
    );
};

FactoriesList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/factories/");
    return {factories: data};
};

export default FactoriesList;