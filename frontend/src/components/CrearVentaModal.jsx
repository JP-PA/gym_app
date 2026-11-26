import { useEffect, useState } from "react";
import FormModal from "./FormModal.jsx";
import { GetUsers } from "../services/user.service";
import { GetProducts } from "../services/product.service";
import { CreateVenta } from "../services/sell.service";
import { apiError } from "../services/api";

const money = value => Number(value).toLocaleString("es-CO", { style: "currency", currency: "COP" });
export default function CrearVentaModal({ onClose, onSuccess }) {
    const [catalog, setCatalog] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [clientId, setClientId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        Promise.all([GetUsers(undefined, controller.signal), GetProducts(undefined, controller.signal)]).then(([clients, products]) => {
            if (!controller.signal.aborted) { setCatalog({ clients, products: products.productos }); setLoadError(""); }
        }).catch(error => { if (!controller.signal.aborted) setLoadError(apiError(error)); });
        return () => controller.abort();
    }, [attempt]);
    function addItem() {
        const product = catalog?.products.find(item => Number(item.id) === Number(productId));
        const count = Number(quantity);
        if (!product || !Number.isInteger(count) || count < 1) { setError("Selecciona un producto y una cantidad entera mayor que cero."); return; }
        const previous = items.find(item => item.producto_id === Number(product.id));
        const nextQuantity = (previous?.cantidad || 0) + count;
        if (nextQuantity > Number(product.stock)) { setError("La cantidad supera el stock disponible."); return; }
        setItems(previous ? items.map(item => item === previous ? { ...item, cantidad: nextQuantity } : item) : [...items, { producto_id: Number(product.id), nombre: product.nombre, precio: Number(product.precio), cantidad: count }]);
        setProductId(""); setQuantity(1); setError("");
    }
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        if (!items.length) { setError("Agrega al menos un producto a la venta."); return; }
        setBusy(true); setError("");
        try {
            await CreateVenta({ usuario_id: Number(clientId), productos: items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad })) });
            onSuccess();
        } catch (error) { setError(apiError(error)); }
        finally { setBusy(false); }
    }
    return <FormModal title="Nueva venta" onClose={onClose} busy={busy}>
        {loadError ? <p className="message error" role="alert">{loadError} <button onClick={() => setAttempt(value => value + 1)}>Reintentar</button></p> : !catalog ? <p role="status">Cargando clientes y productos…</p> : <form className="record-form" onSubmit={submit}>
            <fieldset disabled={busy}>
                <label>Cliente<select required value={clientId} onChange={event => setClientId(event.target.value)}><option value="">Selecciona un cliente</option>{catalog.clients.map(client => <option key={client.id} value={client.id}>{client.nombre} · {client.correo}</option>)}</select></label>
                {!catalog.clients.length && <p className="form-hint">Registra un cliente antes de crear una venta.</p>}
                <div className="sale-add-row"><label>Producto<select value={productId} onChange={event => setProductId(event.target.value)}><option value="">Selecciona un producto</option>{catalog.products.map(product => <option key={product.id} value={product.id} disabled={Number(product.stock) < 1}>{product.nombre} · {money(product.precio)} · Stock: {product.stock}</option>)}</select></label><label>Cantidad<input type="number" min="1" step="1" value={quantity} onChange={event => setQuantity(event.target.value)} /></label><button type="button" onClick={addItem}>Agregar</button></div>
                <div className="table-scroll"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>{!items.length && <tr><td colSpan={4} className="empty-state">Agrega los productos de esta venta.</td></tr>}{items.map(item => <tr key={item.producto_id}><td>{item.nombre}</td><td>{item.cantidad}</td><td>{money(item.precio * item.cantidad)}</td><td><button type="button" aria-label={`Quitar ${item.nombre}`} onClick={() => setItems(items.filter(row => row.producto_id !== item.producto_id))}>Quitar</button></td></tr>)}</tbody></table></div>
                <p className="sale-total">Total estimado: <strong>{money(items.reduce((sum, item) => sum + Math.round(item.precio * 100) * item.cantidad, 0) / 100)}</strong></p><p className="form-hint">El servidor confirmará el precio y las existencias al guardar.</p>
            </fieldset>
            {error && <p className="message error" role="alert">{error}</p>}
            <div className="form-actions"><button type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="add-btn" type="submit" disabled={busy || !items.length || !catalog.clients.length}>{busy ? "Guardando…" : "Registrar venta"}</button></div>
        </form>}
    </FormModal>;
}
