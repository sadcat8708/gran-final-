
const SUPABASE_URL = "https://zuhfxdsnvhzhshbtljeq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8EIA-VF1yZ66d3_asjhGVQ_2XAs7ger";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("¡Supabase está conectado!");

async function probarConexion() {
    const { data, error } = await db
        .from("personas")
        .select("numero, nombre")
        .order("numero");

    if (error) {
        console.error("Error al consultar:", error.message);
        return;
    }

    console.log("Graduados encontrados:", data.length);
    console.table(data);
}

probarConexion();