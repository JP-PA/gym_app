import Sidebar from "../components/sidebar/Sidebar.jsx";
import Navbar from "../components/navbar/Navbar.jsx";

function DashboardLayout({ children }) {

    return (

        <div className="layout">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;