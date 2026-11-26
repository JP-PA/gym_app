import Joi from "joi";
import AppError from "./AppError.js";

const schema = Joi.object({
    page: Joi.number().integer().min(1).max(1000000).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

export function parsePagination(query) {
    if (query.page === undefined && query.limit === undefined) return null;
    const { error, value } = schema.validate({ page: query.page, limit: query.limit });
    if (error) throw new AppError("page debe ser un entero entre 1 y 1000000 y limit entre 1 y 100.", 400);
    return value;
}

// SQL fragments are supplied only by models, never by request input.
export async function queryPage(connection, selectSql, countSql, orderBy, options, params = []) {
    const [[count]] = await connection.query(countSql, params);
    const total = Number(count.total);
    const totalPages = Math.ceil(total / options.limit);
    const page = Math.min(options.page, Math.max(1, totalPages));
    const offset = (page - 1) * options.limit;
    const [data] = await connection.query(`${selectSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [...params, options.limit, offset]);
    return { data, pagination: { page, limit: options.limit, total, totalPages } };
}
