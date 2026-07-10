import supabase from './db-client.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function buildReply(message) {
  const lower = String(message || '').toLowerCase();
  if (lower.includes('plan') || lower.includes('schedule')) return 'I mapped your next 3 hours into deep work, recovery, and review blocks. Your TimeTwin suggests starting with the highest-energy task before meetings fragment attention.';
  if (lower.includes('habit') || lower.includes('goal')) return 'Your habit streak is strongest after 8:30 AM. I recommend pairing study review with your morning planning ritual to increase consistency by 18%.';
  if (lower.includes('report') || lower.includes('export')) return 'I can prepare an executive productivity report with focus hours, completion velocity, blockers, and recommendations. Use the Reports widget on the dashboard to export the current snapshot.';
  return 'I analyzed your workspace signals. The best next action is to protect one 50-minute focus sprint, defer low-value notifications, and close one pending goal before context switching.';
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('timetwin_chat_messages').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required.' });
      const { error: userError } = await supabase.from('timetwin_chat_messages').insert({ role: 'user', message });
      if (userError) throw userError;
      const reply = buildReply(message);
      const { data, error } = await supabase.from('timetwin_chat_messages').insert({ role: 'assistant', message: reply }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Message id is required.' });
      const { error } = await supabase.from('timetwin_chat_messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
