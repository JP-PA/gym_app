import "./Card.css";
export default function Card({ title, value, icon, note }) {
    return <article className="stat-card"><div className="stat-top"><span>{title}</span><span className="stat-icon">{icon}</span></div><p className="stat-value">{value}</p><span className="stat-note">{note}</span></article>;
}
