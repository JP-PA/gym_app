import { obtenerClientesConMensualidadVencida } from "../models/membresias.model.js";
import { enviarRecordatorioMensualidad } from "../services/membershipReminders.service.js";

const reloj = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
});

function fechaDeEnvio() {
    const [fecha, hora] = reloj.format(new Date()).split(" ");
    return Number(hora) >= 8 ? fecha : null;
}

export function iniciarRecordatoriosMensualidad(env = process.env) {
    if (env.MEMBERSHIP_REMINDERS_ENABLED !== "true") return;
    const apiKey = env.RESEND_API_KEY?.trim();
    const from = env.MEMBERSHIP_REMINDERS_FROM?.trim();
    if (!apiKey || !from) {
        console.error("Avisos de mensualidad desactivados: faltan RESEND_API_KEY o MEMBERSHIP_REMINDERS_FROM.");
        return;
    }

    let activo = false;
    let fechaCompletada;
    let fechaProcesada;
    let enviados = new Set();

    async function revisar() {
        const fecha = fechaDeEnvio();
        if (!fecha || fecha === fechaCompletada || activo) return;
        activo = true;
        if (fechaProcesada !== fecha) {
            fechaProcesada = fecha;
            enviados = new Set();
        }

        try {
            const clientes = await obtenerClientesConMensualidadVencida();
            let fallidos = 0;
            for (const cliente of clientes) {
                if (fechaDeEnvio() !== fecha) return;
                if (enviados.has(cliente.id)) continue;
                try {
                    await enviarRecordatorioMensualidad({ cliente, fecha, apiKey, from });
                    enviados.add(cliente.id);
                } catch {
                    fallidos++;
                }
            }
            if (fallidos === 0) fechaCompletada = fecha;
            else console.warn(`Avisos de mensualidad pendientes de reintento: ${fallidos}.`);
        } catch {
            console.error("No se pudieron consultar las mensualidades para enviar avisos.");
        } finally {
            activo = false;
        }
    }

    void revisar();
    const intervalo = setInterval(revisar, 15 * 60 * 1000);
    intervalo.unref();
}
