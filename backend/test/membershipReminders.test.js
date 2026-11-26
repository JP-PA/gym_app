import test from "node:test";
import assert from "node:assert/strict";
import { enviarRecordatorioMensualidad } from "../src/services/membershipReminders.service.js";

const aviso = {
    cliente: { id: 42, correo: "cliente@example.com" },
    fecha: "2026-11-25",
    apiKey: "test-key",
    from: "avisos@example.com"
};

test("el correo usa una clave estable para el mismo cliente y día", async () => {
    const claves = [];
    const request = async (url, options) => {
        assert.equal(url, "https://api.resend.com/emails");
        assert.equal(options.method, "POST");
        assert.deepEqual(JSON.parse(options.body).to, [aviso.cliente.correo]);
        claves.push(options.headers["Idempotency-Key"]);
        return new Response(null, { status: 200 });
    };
    await enviarRecordatorioMensualidad(aviso, request);
    await enviarRecordatorioMensualidad(aviso, request);
    await enviarRecordatorioMensualidad({ ...aviso, fecha: "2026-11-26" }, request);

    assert.equal(claves[0], claves[1]);
    assert.notEqual(claves[0], claves[2]);
});

test("un rechazo del proveedor permite reintentar y omite su cuerpo del error", async () => {
    await assert.rejects(
        enviarRecordatorioMensualidad(aviso, async () => new Response(aviso.cliente.correo, { status: 429 })),
        { message: "El proveedor de correo rechazó el aviso (HTTP 429)." }
    );
});
