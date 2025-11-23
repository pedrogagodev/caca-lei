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

export function getGeminiEnv() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(`Missing GEMINI_API_KEY environment variable. Please check your .env file.`)
  }

  return {
    apiKey,
  }
}

