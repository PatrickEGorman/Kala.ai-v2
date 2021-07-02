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
                        <Dropdown.Item href="/services/materials/list">List</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Machines
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/services/machines/create">Create</Dropdown.Item>
                        <Dropdown.Item href="/services/machines/list">List</Dropdown.Item>
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
            </ul>
        </div>
    </nav>
        ;
};

export default header;