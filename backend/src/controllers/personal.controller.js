import * as personal from "../services/personal.service.js";
import catchAsync from "../utils/catchAsync.js";
import { parseListQuery } from "../utils/listFilters.js";
export const profile = (req, res) => res.json(req.user);
export const memberships = catchAsync(async (req, res) => res.json(await personal.myMemberships(req.user.id, parseListQuery(req.query, "personalMemberships", true))));
export const purchases = catchAsync(async (req, res) => res.json(await personal.myPurchases(req.user.id, parseListQuery(req.query, "personalPurchases", true))));
export const purchase = catchAsync(async (req, res) => res.json(await personal.myPurchase(req.user.id, req.params.id)));
