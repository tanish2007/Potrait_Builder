import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://mruadyddwonjtpaxkjkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydWFkeWRkd29uanRwYXhramtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjA2ODYsImV4cCI6MjA2NTE5NjY4Nn0.ZVLdwO3HBP_ccDjjfvDJVopGYGHOLKKSK6z5Nsg9Ths'

export const supabase = createClient(supabaseUrl, supabaseKey)
