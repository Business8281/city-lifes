import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    try {
        console.log('Testing connection to:', supabaseUrl)
        const { error } = await supabase.auth.getSession()
        if (error) {
            console.error('Connection failed:', error.message)
            process.exit(1)
        }
        console.log('Supabase connection verified successfully!')
    } catch (err) {
        console.error('Unexpected error:', err)
        process.exit(1)
    }
}

verify()
