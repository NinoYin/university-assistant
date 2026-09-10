import { createClient } from "@supabase/supabase-js";

// Cliente con permisos de servidor (service_role) — solo se usa en backend, nunca se expone al navegador
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);