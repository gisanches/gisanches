import { supabase } from '../lib/supabase.js'

export default async function (req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const { data: current, error: getError } = await supabase
    .from('visits_gisanches')
    .select('count')
    .eq('id', 1)
    .single();

  if (getError) {
    return res.status(500).json({ error: getError.message });
  }

  const { data, error: updateError } = await supabase
    .from('visits_gisanches')
    .update({ count: current.count + 1 })
    .eq('id', 1)
    .select();

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="28" role="img" aria-label="Visits: ${data[0].count}">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <mask id="a">
        <rect width="150" height="28" rx="3" fill="#fff"/>
      </mask>
      <g mask="url(#a)">
        <rect width="75" height="28" fill="#555"/>
        <rect x="75" width="75" height="28" fill="#8a63d2"/>
        <rect width="150" height="28" fill="url(#b)"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
        <text x="37.5" y="18" fill="#010101" fill-opacity=".3">Visits</text>
        <text x="37.5" y="17">Visits</text>
        <text x="112.5" y="18" fill="#010101" fill-opacity=".3">${data[0].count}</text>
        <text x="112.5" y="17">${data[0].count}</text>
      </g>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  return res.status(200).send(svg.trim());
}