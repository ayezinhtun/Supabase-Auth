import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alzulkzfacbpafuuaayp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsenVsa3pmYWNicGFmdXVhYXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNjkxODUsImV4cCI6MjA2OTk0NTE4NX0.rSU9uY3bBVxMgtNWLSmsoWgXoaKekm4et56SlH5-sPs'
export const supabase = createClient(supabaseUrl, supabaseKey)
