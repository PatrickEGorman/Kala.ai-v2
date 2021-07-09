import Link from "next/link";
import useRequest from "../../../hooks/use-request";

const MaterialsList = ({invMaterials}) => {
    const invMaterialList = invMaterials.map(invMaterial => {
        const deleteRequest = useRequest({
            url: `/api/materials/inventory/${invMaterial.id}`,
            method: "delete",
            onSuccess: () => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={invMaterial.material.id}>
                <td><Link href={`/services/materials/[materialId]`}
                          as={`/services/materials/${invMaterial.material.id}`}>
                    {invMaterial.material.name}</Link></td>
                <td><Link href={`/services/factories/[factoryId]`} as={`/services/factories/${invMaterial.factory.id}`}>
                    {invMaterial.factory.name}</Link></td>
                <td> {invMaterial.quantity}</td>
                <td>
                    <Link href={`/services/materials/inventory/[inventoryId]`}
                          as={`/services/materials/inventory/${invMaterial.id}`}>
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
                    <th>Material</th>
                    <th>Factory</th>
                    <th>Quantity</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {invMaterialList}
                </tbody>
            </table>
        </div>
    );
};

MaterialsList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/materials/inventory/");
    return {invMaterials: data, title: "Inventory List"};
};

export default MaterialsList;