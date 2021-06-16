import Link from "next/link";

export default () => {

    const links = [
        {label: "Inventory", href: "/services/materials/list"}
    ].filter(linkConfig => linkConfig)
        .map(({label, href}) => {
            return <li key={href} className={"nav-item"}>
                <Link href={href}>
                    <a className={"nav-link"}>{label}</a>
                </Link>
            </li>;
        });
    return <nav className={"navbar navbar-ligth bg-light"}>
        <Link href={"/"}>
            <a className={"navbar-brand"}>GitTix</a>
        </Link>

        <div className={"d-flex justify-content-end"}>
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
        ;
};