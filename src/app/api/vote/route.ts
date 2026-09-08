import { createClient } from '@supabase/supabase-js';
import { crypto } from 'crypto';

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  try {
    const { wardId, candidateId } = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";
    const ipHash = crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'salt')).digest('hex');

    const { error } = await supabase.from('votes').insert({ ward_id: wardId, candidate_id: candidateId, ip_hash: ipHash });

    if (error) {
      if (error.code === '23505') return Response.json({ error: 'आपने इस वार्ड में पहले ही वोट दे दिया है।' }, { status: 400 });
      return Response.json({ error: 'वोट दर्ज नहीं हो सका।' }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'सर्वर एरर' }, { status: 500 });
  }
}
