import Link from "next/link";
import {Dropdown} from "react-bootstrap";

const header = () => {

    return <nav className={"navbar navbar-dark bg-dark"}>
        <Link href={"/"}>
            <a className={"navbar-brand"}>Kala.ai V2</a>
        </Link>

        <div className={"d-flex justify-content-end"}>
            <ul className="nav d-flex align-items-center">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Materials
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/materials/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/list">Catalog</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/purchase">Purchase</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/inventory">Inventory</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Machines
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/machines/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/list">Catalog</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/purchase">Purchase</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/inventory">Inventory</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Factories
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/factories/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/factories/list">List</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Products
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/products/steps/create">Create Step</Dropdown.Item>
                        <Dropdown.Item href="/services/products/steps/list">List Steps</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </div>
    </nav>
        ;
};

export default header;