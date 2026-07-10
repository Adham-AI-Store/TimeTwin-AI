import supabase from './db-client.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { type } = req.query;
      let query = supabase.from('timetwin_tasks').select('*').order('due_date', { ascending: true });
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { title, type = 'task', priority = 'Focus', due_date, progress = 0, notes = '' } = req.body;
      if (!title || !due_date) return res.status(400).json({ error: 'Title and due date are required.' });
      const { data, error } = await supabase.from('timetwin_tasks').insert({ title, type, priority, due_date, progress, notes, completed: false }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...set } = req.body;
      if (!id) return res.status(400).json({ error: 'Task id is required.' });
      const { data, error } = await supabase.from('timetwin_tasks').update(set).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Task id is required.' });
      const { error } = await supabase.from('timetwin_tasks').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
