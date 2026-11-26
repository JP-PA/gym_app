export function jwtSecret() {
    if (!process.env.JWT_SECRET) throw new Error("Configura JWT_SECRET antes de iniciar el backend.");
    return process.env.JWT_SECRET;
}
