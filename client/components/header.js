import Link from "next/link";
import {Dropdown, Navbar} from "react-bootstrap";

const header = () => {

    return <Navbar className={"navbar navbar-light bg-secondary"}>
        <ul className={"nav navbar-nav"}>
            <li className={"nav-item"}>
                <Link href={"/"}>
                    <a className={"navbar-brand"}>Kala.ai V2</a>
                </Link>
            </li>
            <li className={"nav-item"}>
                <Dropdown>
                    <Dropdown.Toggle className={"nav-link"} variant="success" id="dropdown-basic">
                        Materials
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/materials/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/list">Catalog</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/purchase">Purchase</Dropdown.Item>
                        <Dropdown.Item href="/services/materials/inventory">Inventory</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </li>
            <li className={"nav-item"}>
                <Dropdown>
                    <Dropdown.Toggle className={"nav-link"} variant="success" id="dropdown-basic">
                        Machines
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/machines/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/list">Catalog</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/purchase">Purchase</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/inventory">Inventory</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </li>
            <li className={"nav-item"}>
                <Dropdown>
                    <Dropdown.Toggle className={"nav-link"} variant="success" id="dropdown-basic">
                        Factories
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/factories/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/factories/list">List</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </li>
            <li className={"nav-item"}>
                <Dropdown>
                    <Dropdown.Toggle className={"nav-link"} variant="success" id="dropdown-basic">
                        Products
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/products/steps/create">Create Step</Dropdown.Item>
                        <Dropdown.Item href="/services/products/steps/list">List Steps</Dropdown.Item>
                        <Dropdown.Item href="/services/products/products/create">Create Product</Dropdown.Item>
                        <Dropdown.Item href="/services/products/products/list">List Product</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </li>
        </ul>
        <div style={{height: "30vh"}}>

        </div>
    </Navbar>
        ;
};

export default header;