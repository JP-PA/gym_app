import Joi from 'joi';
import AppError from './AppError.js';
import { parsePagination, queryPage } from './pagination.js';

const text = () => Joi.string().trim().max(100);
const amount = () => Joi.number().min(0).max(99999999.99).precision(2);
const day = () => Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).custom((value, helpers) => {
    const date = new Date(value + 'T00:00:00Z');
    return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || value < '1000-01-01' ? helpers.error('any.invalid') : value;
});
const membershipFields = {
    tipo: Joi.string().valid('mensual', 'trimestral', 'semestral', 'anual'),
    estado: Joi.string().valid('activa', 'vencida'),
    fechaCampo: Joi.string().valid('inicio', 'vencimiento'),
    fechaDesde: day(), fechaHasta: day(), precioMin: amount(), precioMax: amount()
};
const saleFields = { fechaDesde: day(), fechaHasta: day(), totalMin: amount(), totalMax: amount() };
const fields = {
    users: { q: text(), nombre: text(), correo: text() },
    products: { q: text(), precioMin: amount(), precioMax: amount(), stock: Joi.string().valid('disponible', 'agotado') },
    memberships: { q: text(), ...membershipFields },
    sales: { q: text(), ...saleFields },
    personalMemberships: membershipFields,
    personalPurchases: { q: text(), ...saleFields }
};

export function parseListQuery(query, resource, alwaysPaginated = false) {
    const definition = fields[resource];
    const input = {};
    for (const key of Object.keys(definition)) {
        if (query[key] !== undefined && !(typeof query[key] === 'string' && query[key].trim() === '')) input[key] = query[key];
    }
    const { value, error } = Joi.object(definition).validate(input);
    if (error) throw new AppError('Filtros inválidos. Revisa los textos, fechas, importes y opciones seleccionadas.', 400);
    for (const [min, max] of [['precioMin', 'precioMax'], ['totalMin', 'totalMax'], ['fechaDesde', 'fechaHasta']]) {
        if (value[min] !== undefined && value[max] !== undefined && value[min] > value[max]) {
            throw new AppError('El inicio del rango debe ser menor o igual que el final.', 400);
        }
    }
    const pagination = parsePagination(query);
    if (!pagination && !alwaysPaginated && !Object.keys(value).length) return null;
    return { ...(pagination || { page: 1, limit: 10 }), filters: value };
}

// Only allowlisted column names and SQL fragments are used. All user values are bound.
export function buildFilters(resource, filters = {}, userId) {
    const clauses = [];
    const params = [];
    const add = (sql, ...values) => { clauses.push(sql); params.push(...values); };
    const like = value => '%' + value.replace(/[!%_]/g, char => '!' + char) + '%';
    const match = column => `LOWER(${column}) LIKE LOWER(?) ESCAPE '!'`;
    const membership = resource === 'memberships' || resource === 'personalMemberships';
    const personal = resource === 'personalMemberships' || resource === 'personalPurchases';
    if (personal) {
        if (!Number.isSafeInteger(userId) || userId < 1) throw new AppError('Identidad requerida', 401);
        add(`${membership ? 'm' : 'v'}.usuario_id = ?`, userId);
    }
    if (filters.q) {
        if (resource === 'users' || resource === 'memberships' || resource === 'sales') {
            add(`(${match('u.nombre')} OR ${match('u.correo')})`, like(filters.q), like(filters.q));
        } else if (resource === 'products') add(match('p.nombre'), like(filters.q));
        else if (resource === 'personalPurchases') {
            add(`(${match('CAST(v.id AS CHAR)')} OR EXISTS (SELECT 1 FROM detalle_ventas dv JOIN productos p ON p.id = dv.producto_id WHERE dv.venta_id = v.id AND ${match('p.nombre')}))`, like(filters.q), like(filters.q));
        }
    }
    if (resource === 'users') {
        for (const key of ['nombre', 'correo']) if (filters[key]) add(match(`u.${key}`), like(filters[key]));
    }
    const price = resource === 'products' ? 'p.precio' : membership ? 'm.precio' : 'v.total';
    const minKey = membership || resource === 'products' ? 'precioMin' : 'totalMin';
    const maxKey = membership || resource === 'products' ? 'precioMax' : 'totalMax';
    if (filters[minKey] !== undefined) add(`${price} >= ?`, filters[minKey]);
    if (filters[maxKey] !== undefined) add(`${price} <= ?`, filters[maxKey]);
    if (resource === 'products' && filters.stock) clauses.push(filters.stock === 'disponible' ? 'p.stock > 0' : 'p.stock = 0');
    if (membership) {
        if (filters.tipo) add('m.tipo = ?', filters.tipo);
        if (filters.estado) clauses.push(filters.estado === 'activa' ? 'm.fecha_fin >= CURDATE()' : 'm.fecha_fin < CURDATE()');
    }
    const dateColumn = membership ? (filters.fechaCampo === 'inicio' ? 'm.fecha_inicio' : 'm.fecha_fin') : 'v.fecha';
    if (filters.fechaDesde) add(`${dateColumn} >= ?`, filters.fechaDesde);
    // Includes the whole final day, including timestamp fractions.
    if (filters.fechaHasta) add(`${dateColumn} <= CONCAT(?, ' 23:59:59.999999')`, filters.fechaHasta);
    return { sql: clauses.length ? ' WHERE ' + clauses.join(' AND ') : '', params };
}

export function queryFilteredPage(connection, resource, select, from, orderBy, options, userId) {
    const { sql, params } = buildFilters(resource, options.filters, userId);
    return queryPage(connection, `${select} ${from}${sql}`, `SELECT COUNT(*) AS total ${from}${sql}`, orderBy, options, params);
}
