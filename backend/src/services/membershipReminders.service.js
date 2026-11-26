export async function enviarRecordatorioMensualidad({ cliente, fecha, apiKey, from }, request = fetch) {
    const response = await request("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `mensualidad-vencida/${fecha}/${cliente.id}`
        },
        body: JSON.stringify({
            from,
            to: [cliente.correo],
            subject: "Tu mensualidad del gimnasio está vencida",
            text: "Tu mensualidad del gimnasio ha vencido. Comunícate con la administración del gimnasio si deseas renovarla."
        }),
        signal: AbortSignal.timeout(10_000)
    });

    await response.body?.cancel();
    if (!response.ok) throw new Error(`El proveedor de correo rechazó el aviso (HTTP ${response.status}).`);
}
