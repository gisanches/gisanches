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
    return res.status(500).json({ error: error?.message || 'No data' });
  }

  const newCount = data.count + 1;

  await supabase
    .from('visits_gisanches')
    .update({ count: newCount })
    .eq('id', 1);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20">
      <text x="50" y="14" text-anchor="middle" font-size="12">Visits: ${newCount}</text>
    </svg>
  `;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).send(svg);
}