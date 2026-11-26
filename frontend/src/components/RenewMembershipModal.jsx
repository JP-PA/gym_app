import { useState } from "react";
import FormModal from "./FormModal.jsx";
import { RenewMembership } from "../services/memberships.service";
import { apiError } from "../services/api";

export default function RenewMembershipModal({ membership, onClose, onSuccess }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const values = new FormData(event.currentTarget);
        setBusy(true); setError("");
        try {
            await RenewMembership(membership.id, { tipo: values.get("tipo"), precio: Number(values.get("precio")) });
            onSuccess();
        } catch (error) { setError(apiError(error)); }
        finally { setBusy(false); }
    }
    return <FormModal title="Renovar membresía vencida" onClose={onClose} busy={busy}>
        <form className="record-form" onSubmit={submit}>
            <p>Cliente: <strong>{membership.usuario_nombre}</strong> · Membresía #{membership.id}</p>
            <fieldset disabled={busy}>
                <label>Plan<select name="tipo" required defaultValue={membership.tipo}>
                    <option value="mensual">Mensual · 30 días</option>
                    <option value="trimestral">Trimestral · 90 días</option>
                    <option value="semestral">Semestral · 180 días</option>
                    <option value="anual">Anual · 365 días</option>
                </select></label>
                <label>Precio<input name="precio" type="number" min="0.01" max="99999999.99" step="0.01" required defaultValue={membership.precio} /></label>
                <p className="form-hint">El nuevo período comienza hoy, según la fecha del servidor de base de datos. Se conserva el cliente y se reemplazan las fechas del período vencido.</p>
            </fieldset>
            {error && <p className="message error" role="alert">{error}</p>}
            <div className="form-actions"><button type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="add-btn" type="submit" disabled={busy}>{busy ? "Renovando…" : "Confirmar renovación"}</button></div>
        </form>
    </FormModal>;
}
