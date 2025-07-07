import { createClient } from '@supabase/supabase-js'

// BELANGRIJK: Vervang deze placeholder waarden met je echte Supabase gegevens
// Je kunt deze vinden in je Supabase project dashboard onder Settings -> API
const supabaseUrl = 'YOUR_SUPABASE_URL' // Vervang met je Supabase URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Vervang met je Supabase anon key

// Controleer of de configuratie is ingesteld
if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn(
    'SUPABASE CONFIGURATIE ONTBREEKT: Vergeet niet om je Supabase URL en anon key in te stellen in src/lib/supabase.ts'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functie om te controleren of een gebruiker is ingelogd
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper functie voor uitloggen
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
  }
  return { error }
} 