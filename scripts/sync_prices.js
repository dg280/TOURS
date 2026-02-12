import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ojfjypopdlpaqawfgswx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZmp5cG9wZGxwYXFhd2Znc3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTM4NzMsImV4cCI6MjA4NjQ2OTg3M30.SZ0VCxuy-gXq-CyyWsuVMdcrtnKbpO3qCD1IL4cF4KI'
const supabase = createClient(supabaseUrl, supabaseKey)

const tours = [
    { id: 1, price: 145 },
    { id: 4, price: 95 },
    { id: 5, price: 75 },
    { id: 6, price: 125 },
    { id: 7, price: 165 },
    { id: 2, price: 55 },
    { id: 3, price: 85 }
]

async function sync() {
    console.log('Starting price sync...')
    for (const tour of tours) {
        const { error } = await supabase
            .from('tours')
            .update({ price: tour.price })
            .eq('id', tour.id)

        if (error) {
            console.error(`Error updating tour ${tour.id}:`, error)
        } else {
            console.log(`Updated tour ${tour.id} with price ${tour.price}€`)
        }
    }
    console.log('Sync complete.')
}

sync()
