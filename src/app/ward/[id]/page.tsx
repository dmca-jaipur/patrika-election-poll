'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function VotingPage({ params }: { params: { id: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [ward, setWard] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase.from('wards').select('*').eq('id', params.id).single();
      const { data: c } = await supabase.from('candidates').select('*').eq('ward_id', params.id).order('display_order');
      setWard(w);
      setCandidates(c || []);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleVote = async () => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ wardId: params.id, candidateId: selected.id }),
    });

    if (res.ok) {
      setVoted(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#800000', '#D4AF37'] });
    } else {
      const err = await res.json();
      alert(err.error || "त्रुटि! शायद आप वोट दे चुके हैं।");
    }
    setIsConfirming(false);
  };

  if (loading) return <div className="h-screen bg-[#FDFCF0] flex items-center justify-center font-bold">लोड हो रहा है...</div>;

  return (
    <div className="bg-[#FDFCF0] min-h-screen">
      <header className="bg-[#800000] text-white p-6 text-center border-b-4 border-[#D4AF37] shadow-xl">
        <p className="text-[10px] tracking-widest opacity-80 mb-1 uppercase">पत्रिका जयपुर न्यूज़</p>
        <h1 className="text-2xl md:text-4xl font-bold">{ward?.title || "नगर पालिका चुनाव 2026"}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A237E]">{ward?.ward_name} — जनमत सर्वेक्षण</h2>
          <div className="mt-4 bg-[#800000]/10 py-2 px-4 inline-block border border-[#800000]/20 rounded">
            <p className="text-[#800000] font-bold text-sm md:text-base italic">“यह जनमत सर्वेक्षण केवल इस वार्ड के मतदाताओं के लिए है।”</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {candidates.map((c) => (
            <div key={c.id} className="bg-white border-2 border-gray-100 shadow-md group">
              <div className="h-56 bg-gray-100 overflow-hidden">
                <img src={c.photo_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-1">{c.name}</h3>
                <p className="text-[#1A237E] font-medium mb-6">{c.party_name}</p>
                <button onClick={() => { setSelected(c); setIsConfirming(true); }} className="w-full bg-[#800000] text-white py-3 font-bold hover:bg-[#1A237E] transition">वोट करें</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 border-t pt-8 text-center text-gray-400 text-xs italic">
          “यह एक अनौपचारिक जनमत सर्वेक्षण है। यह किसी आधिकारिक चुनावी परिणाम का प्रतिनिधित्व नहीं करता।”
        </footer>
      </main>

      <AnimatePresence>
        {isConfirming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-8 max-w-sm w-full text-center border-t-8 border-[#800000] shadow-2xl">
              <h3 className="text-xl mb-6">क्या आप <span className="font-bold text-[#800000]">{selected?.name}</span> को अपना मत देना चाहते हैं?</h3>
              <div className="flex gap-4">
                <button onClick={handleVote} className="flex-1 bg-green-700 text-white py-3 font-bold shadow-lg">हाँ, वोट करें</button>
                <button onClick={() => setIsConfirming(false)} className="flex-1 bg-gray-200 py-3 font-bold">रद्द करें</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {voted && (
        <div className="fixed inset-0 bg-[#FDFCF0] z-[100] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-5xl font-bold text-[#800000] mb-2">मत दर्ज हो गया!</h2>
          <p className="text-xl mb-10">आपने <span className="font-bold underline">{selected?.name}</span> को अपना मत दिया है।</p>
          <button onClick={() => window.location.href=`/results/${params.id}`} className="bg-[#1A237E] text-white px-10 py-4 font-bold text-lg shadow-xl">परिणाम देखें</button>
        </div>
      )}
    </div>
  );
}
