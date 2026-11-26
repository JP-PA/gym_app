const planOptions = [['mensual', 'Mensual'], ['trimestral', 'Trimestral'], ['semestral', 'Semestral'], ['anual', 'Anual']];
export default function SearchFilters({ resource, list }) {
    const membership = resource === 'memberships' || resource === 'personalMemberships';
    const personal = resource === 'personalMemberships' || resource === 'personalPurchases';
    const sale = resource === 'sales' || resource === 'personalPurchases';
    const product = resource === 'products';
    const { filters, setFilter, clearFilters } = list;
    const field = (name, label, type = 'text', placeholder = '') => <label key={name}>{label}<input name={name} type={type} value={filters[name] || ''} onChange={event => setFilter(name, event.target.value)} placeholder={placeholder} {...(type === 'number' ? { min: 0, max: 99999999.99, step: '0.01' } : ['text', 'search'].includes(type) ? { maxLength: 100 } : {})} /></label>;
    const select = (name, label, options, defaultLabel = 'Todos') => <label key={name}>{label}<select name={name} value={filters[name] || ''} onChange={event => setFilter(name, event.target.value)}><option value="">{defaultLabel}</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
    const hasFilters = Object.values(filters).some(Boolean);
    return <section className="search-filters" aria-label="Búsqueda y filtros">
        <div className="search-filters-heading"><strong>Buscar y filtrar</strong><button type="button" disabled={!hasFilters} onClick={clearFilters}>Limpiar filtros</button></div>
        <div className="search-filter-fields">
            {resource !== 'personalMemberships' && field('q', 'Buscar', 'search', resource === 'users' ? 'Nombre o correo' : product ? 'Nombre del producto' : personal ? 'Producto o número de compra' : 'Nombre o correo del cliente')}
            {membership && <>{select('tipo', 'Plan', planOptions)}{select('estado', 'Estado', [['activa', 'Activa'], ['vencida', 'Vencida']])}{select('fechaCampo', 'Filtrar fechas de', [['inicio', 'Inicio']], 'Vencimiento')}</>}
            {(membership || sale) && <>{field('fechaDesde', 'Desde', 'date')}{field('fechaHasta', 'Hasta', 'date')}</>}
            {(membership || product) && <>{field('precioMin', 'Precio mínimo', 'number')}{field('precioMax', 'Precio máximo', 'number')}</>}
            {sale && <>{field('totalMin', 'Total mínimo', 'number')}{field('totalMax', 'Total máximo', 'number')}</>}
            {product && select('stock', 'Stock', [['disponible', 'Con existencias'], ['agotado', 'Agotado']])}
        </div>
        {hasFilters && <p className="form-hint" role="status">{list.pending ? 'Esperando a que termines de escribir…' : list.loading ? 'Buscando…' : list.error ? 'Revisa los filtros o vuelve a intentar.' : `${list.pagination.total} resultados encontrados.`}</p>}
    </section>;
}
