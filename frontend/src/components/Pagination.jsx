export default function Pagination({ pagination, setPage, setLimit, loading, error }) {
    const { page, limit, total, totalPages } = pagination;
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    return <nav className="pagination" aria-label="Paginación del listado">
        <label>Filas por página <select value={limit} disabled={loading} onChange={event => setLimit(Number(event.target.value))}>
            {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
        </select></label>
        <span aria-live="polite">{loading ? "Cargando…" : error ? "No se pudo cargar el listado" : `${start}–${Math.min(page * limit, total)} de ${total} registros`}</span>
        <div className="pagination-buttons">
            <button disabled={loading || error || page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
            <span>Página {page} de {Math.max(1, totalPages)}</span>
            <button disabled={loading || error || page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
    </nav>;
}
