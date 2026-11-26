import { useEffect, useRef, useState } from "react";
import { apiError } from "../services/api.js";

export default function usePaginatedList(fetchPage) {
    const [request, setRequest] = useState({ page: 1, limit: 10 });
    const [filters, setFilters] = useState({});
    const draft = useRef({});
    const timer = useRef(null);
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState(null);
    const [retry, setRetry] = useState(0);
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => {
        const controller = new AbortController();
        fetchPage(request, controller.signal).then(response => {
            if (!controller.signal.aborted) setResult({ ...response, request, retry, error: false });
        }).catch(error => {
            if (!controller.signal.aborted) setResult({ data: [], pagination: { ...request, total: 0, totalPages: 0 }, request, retry, error: true, errorMessage: apiError(error) });
        });
        return () => controller.abort();
    }, [fetchPage, request, retry]);
    function setFilter(name, value) {
        clearTimeout(timer.current);
        const next = { ...draft.current, [name]: value };
        draft.current = next;
        setFilters(next);
        const apply = () => {
            const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== ''));
            setRequest(previous => ({ page: 1, limit: previous.limit, ...clean }));
            setPending(false);
        };
        if (['q', 'nombre', 'correo'].includes(name)) { setPending(true); timer.current = setTimeout(apply, 300); }
        else apply();
    }
    function clearFilters() {
        clearTimeout(timer.current); draft.current = {}; setFilters({}); setPending(false);
        setRequest(previous => ({ page: 1, limit: previous.limit }));
    }
    const loading = !result || result.request !== request || result.retry !== retry;
    const pagination = result?.pagination || { ...request, total: 0, totalPages: 0 };
    return {
        data: loading ? [] : result.data,
        loading,
        error: !loading && result.error,
        errorMessage: !loading ? result?.errorMessage : '',
        pagination, filters, setFilter, clearFilters, pending,
        setPage: page => setRequest({ ...request, page }),
        setLimit: limit => setRequest({ ...request, page: 1, limit }),
        retry: () => setRetry(value => value + 1)
    };
}
