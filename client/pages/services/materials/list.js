import Link from "next/link";
import useRequest from "../../../hooks/use-request";

const MaterialsList = ({materials}) => {
    const materialList = materials.map(material => {
        const deleteRequest = useRequest({
            url: `/api/materials/catalog/${material.id}`,
            method: "delete",
            onSuccess: (material) => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={material.id}>
                <td>{material.name}</td>
                <td>{material.cost}</td>
                <td>
                    <Link href={`/services/materials/[materialId]`} as={`/services/materials/${material.id}`}>
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
            <h1>Materials</h1>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Cost</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {materialList}
                </tbody>
            </table>
        </div>
    );
};

MaterialsList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/materials/catalog/");
    return {materials: data};
};

export default MaterialsList;