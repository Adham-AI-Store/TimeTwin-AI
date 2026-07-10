import supabase from './db-client.js';

const tables = {
  plans: 'timetwin_plans',
  faqs: 'timetwin_faqs',
  testimonials: 'timetwin_testimonials',
  roadmap: 'timetwin_roadmap',
  users: 'timetwin_users'
};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const resource = req.query.resource || req.body.resource;
    const table = tables[resource];
    if (!table) return res.status(400).json({ error: 'Unknown content resource.' });
    if (req.method === 'GET') {
      const { data, error } = await supabase.from(table).select('*').order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT' && resource === 'users') {
      const { id, ...set } = req.body;
      const { data, error } = await supabase.from(table).update(set).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
