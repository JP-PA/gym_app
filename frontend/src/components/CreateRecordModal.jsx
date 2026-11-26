import { useEffect, useState } from "react";
import FormModal from "./FormModal.jsx";
import { CreateProduct } from "../services/product.service";
import { CreateUser, GetUsers } from "../services/user.service";
import { CreateMembership } from "../services/memberships.service";
import { apiError } from "../services/api";

const forms = {
    product: { title: "Nuevo producto", save: CreateProduct },
    user: { title: "Nuevo cliente", save: CreateUser },
    membership: { title: "Nueva membresía", save: CreateMembership }
};
export default function CreateRecordModal({ kind, onClose, onSuccess }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [clients, setClients] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        if (kind !== "membership") return;
        const controller = new AbortController();
        GetUsers(undefined, controller.signal).then(data => {
            if (!controller.signal.aborted) { setClients(data); setLoadError(""); }
        }).catch(error => { if (!controller.signal.aborted) setLoadError(apiError(error)); });
        return () => controller.abort();
    }, [kind, attempt]);
    const { title, save } = forms[kind];
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const values = Object.fromEntries(new FormData(event.currentTarget));
        if (kind === "product") { values.precio = Number(values.precio); values.stock = Number(values.stock); }
        if (kind === "membership") { values.usuario_id = Number(values.usuario_id); values.precio = Number(values.precio); }
        setBusy(true); setError("");
        try { await save(values); onSuccess(); }
        catch (error) { setError(apiError(error)); }
        finally { setBusy(false); }
    }
    return <FormModal title={title} onClose={onClose} busy={busy}>
        <form onSubmit={submit} className="record-form">
            <fieldset disabled={busy}>
            {kind !== "membership" && <label>Nombre<input name="nombre" required minLength={kind === "user" ? 4 : 2} maxLength={100} autoComplete={kind === "user" ? "name" : "off"} /></label>}
            {kind === "user" && <><label>Correo electrónico<input name="correo" type="email" maxLength={100} required autoComplete="email" /></label><label>Contraseña<input name="password" type="password" required minLength={8} maxLength={40} autoComplete="new-password" /><small>De 8 a 40 caracteres, con mayúscula, minúscula, número y símbolo.</small></label><p className="form-hint">El cliente se registrará como usuario del sistema.</p></>}
            {kind === "membership" && <>
                {loadError ? <p className="message error" role="alert">{loadError} <button type="button" onClick={() => setAttempt(value => value + 1)}>Reintentar</button></p> : clients === null ? <p role="status">Cargando clientes…</p> : clients.length === 0 ? <p className="form-hint">Registra un cliente antes de crear su membresía.</p> : null}
                <label>Cliente<select name="usuario_id" required defaultValue="" disabled={!clients?.length || !!loadError}><option value="">Selecciona un cliente</option>{clients?.map(client => <option key={client.id} value={client.id}>{client.nombre} · {client.correo}</option>)}</select></label>
                <label>Plan<select name="tipo" required defaultValue="mensual"><option value="mensual">Mensual · 30 días</option><option value="trimestral">Trimestral · 90 días</option><option value="semestral">Semestral · 180 días</option><option value="anual">Anual · 365 días</option></select></label><p className="form-hint">La membresía comienza hoy. El servidor calculará su fecha de vencimiento.</p>
            </>}
            {kind !== "user" && <label>Precio<input name="precio" type="number" min="0.01" max="99999999.99" step="0.01" required /></label>}
            {kind === "product" && <label>Stock inicial<input name="stock" type="number" min="0" max="2147483647" step="1" required defaultValue="0" /></label>}
            </fieldset>
            {error && <p className="message error" role="alert">{error}</p>}
            <div className="form-actions"><button type="button" disabled={busy} onClick={onClose}>Cancelar</button><button type="submit" className="add-btn" disabled={busy || (kind === "membership" && (!clients?.length || !!loadError))}>{busy ? "Guardando…" : "Guardar"}</button></div>
        </form>
    </FormModal>;
}
