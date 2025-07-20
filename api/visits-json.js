import { supabase } from '../lib/supabase.js'

export default async function (req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data: current, error: getError } = await supabase
    .from('visits_gisanches')
    .select('count')
    .eq('id', 1);

  if (getError || !current || !current[0]) {
    return res.status(500).json({
      schemaVersion: 1,
      label: "visits_gisanches",
      message: "error",
      color: "red"
    });
  }

  const newCount = current[0].count + 1;

  const { error: updateError } = await supabase
    .from('visits_gisanches')
    .update({ count: newCount })
    .eq('id', 1);

  if (updateError) {
    return res.status(500).json({
      schemaVersion: 1,
      label: "visits_gisanches",
      message: "error",
      color: "red"
    });
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    schemaVersion: 1,
    label: "visits_gisanches",
    message: String(newCount),
    color: "8a63d2"
  });
}