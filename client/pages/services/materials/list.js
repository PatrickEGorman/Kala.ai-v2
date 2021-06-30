const MaterialsList = ({materials}) => {
    const materialList = materials.map(material => {
        return (
            <tr key={material.id}>
                <td>{material.name}</td>
                <td>{material.cost}</td>
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
    const {data} = await client.get("/api/materials/");
    return {materials: data};
};

export default MaterialsList;