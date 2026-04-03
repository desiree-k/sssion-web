import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://jqmvznvbeueywvadexwd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbXZ6bnZiZXVleXd2YWRleHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTA1NjIsImV4cCI6MjA5MDA2NjU2Mn0.IAWhCRQN_uyTgB1XTrPhmRAXMEjtlrkn6Rp9bShwzX8'
)
