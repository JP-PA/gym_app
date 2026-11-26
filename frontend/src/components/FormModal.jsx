import { useEffect, useRef } from "react";

export default function FormModal({ title, children, onClose, busy = false }) {
    const dialog = useRef(null);
    useEffect(() => {
        const element = dialog.current;
        const previous = document.activeElement;
        element.showModal();
        return () => { element.close(); previous?.focus(); };
    }, []);
    return <dialog className="form-dialog" ref={dialog} aria-label={title} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
        <div className="form-dialog-header"><h2>{title}</h2><button type="button" aria-label="Cerrar formulario" disabled={busy} onClick={onClose}>×</button></div>
        {children}
    </dialog>;
}
