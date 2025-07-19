import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('visits_gisanches')
    .select('count')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return res.status(500).json({
      schemaVersion: 1,
      label: 'visits',
      message: 'error',
      color: 'red',
    });
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    schemaVersion: 1,
    label: 'visits',
    message: String(data.count),
    color: '8a63d2'
  });
}