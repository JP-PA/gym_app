import DashboardLayout from ".././layouts/dashboardlayout";
import Card from "../components/Card.jsx"

function Dashboard() {

    return (

        <DashboardLayout>

            <div className="cards-container">

                <Card
                    title="Usuarios"
                    value="120"
                />

                <Card
                    title="Ventas"
                    value="$400"
                />

            </div>

        </DashboardLayout>
    );
}

export default Dashboard;