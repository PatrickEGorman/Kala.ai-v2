import Link from "next/link";
import useRequest from "../../../../hooks/use-request";

const ProductsList = ({products}) => {
    const productList = products.map(product => {
        const deleteRequest = useRequest({
            url: `/api/products/products/${product.id}`,
            method: "delete",
            onSuccess: (product) => location.reload()
        });
        const onDeleteSubmit = async event => {
            event.preventDefault();

            await deleteRequest.doRequest();
        };
        return (
            <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.steps.length}</td>
                <td>{product.value}</td>
                <td>{product.SKU}</td>
                <td>
                    <Link href={`/services/products/products/[productId]`}
                          as={`/services/products/products/${product.id}`}>
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
            <h1>Products</h1>
            <table className={"table"}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th># of Steps</th>
                    <th>Value</th>
                    <th>SKU</th>
                    <th>View</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {productList}
                </tbody>
            </table>
        </div>
    );
};

ProductsList.getInitialProps = async (context, client) => {
    const {data} = await client.get("/api/products/products/");
    return {products: data};
};

export default ProductsList;