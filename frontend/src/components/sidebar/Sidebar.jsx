import "./Sidebar.css";
import { Link } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaBox,
    FaMoneyBill,
    FaTicketAlt
} from "react-icons/fa";

function Sidebar() {

    return (

        <div className="sidebar">

            <h2 className="logo">

            </h2>

            <ul>

                <li>

                    <Link to="/dashboard">

                        <FaHome />
                        <span>Dashboard</span>

                    </Link>

                </li>

                <li>

                    <Link to="/users">

                        <FaUsers />
                        <span>Usuarios</span>

                    </Link>

                </li>

                <li>

                    <Link to="/products">

                        <FaBox />
                        <span>Productos</span>

                    </Link>

                </li>

                <li>

                    <Link to="/sells">

                        <FaMoneyBill />
                        <span>Ventas</span>

                    </Link>

                </li>

                <li>

                    <Link to="/memberships">

                        <FaTicketAlt />
                        <span>Membresías</span>

                    </Link>

                </li>

            </ul>

        </div>
    );
}

export default Sidebar;