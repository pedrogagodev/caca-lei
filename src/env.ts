export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(`Missing Supabase environment variables. Please check your .env file.`)
  }

  return {
    url,
    anonKey,
  }
}

export function getCamaraEnv() {
  const url = process.env.NEXT_PUBLIC_CAMARA_API_URL

  if (!url) {
    throw new Error(`Missing Camara API environment variables. Please check your .env file.`)
  }

  return {
    url,
  }
}