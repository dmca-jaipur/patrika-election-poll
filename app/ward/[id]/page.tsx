// यह कोड आपकी वेबसाइट का चेहरा है (Premium Hindi News Style)
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';

// डेटाबेस कनेक्शन
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VotingPage({ params }: { params: { id: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [wardInfo, setWardInfo] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // वार्ड की जानकारी लाना
      const { data: ward } = await supabase.from('wards').select('*').eq('id', params.id).single();
      // प्रत्याशियों की जानकारी लाना
      const { data: cands } = await supabase.from('candidates').select('*').eq('ward_id', params.id).order('display_order');
      
      setWardInfo(ward);
      setCandidates(cands || []);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  const handleVote = async () => {
    // यहाँ हम सर्वर को बोलेंगे कि वोट डालो (IP चेक के साथ)
    const response = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ wardId: params.id, candidateId: selected.id }),
    });

    if (response.ok) {
      setVoted(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#800000', '#D4AF37'] });
    } else {
      const err = await response.json();
      alert(err.error || "त्रुटि! शायद आप वोट दे चुके हैं।");
    }
    setIsConfirming(false);
  };

  if (loading) return <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center font-bold text-[#800000]">लोड हो रहा है...</div>;

  return (
    <div className="bg-[#FDFCF0] min-h-screen text-slate-900 font-hindi">
      {/* Premium Header */}
      <div className="bg-[#800000] text-white py-6 text-center shadow-xl border-b-4 border-[#D4AF37]">
        <p className="text-[10px] tracking-[4px] uppercase mb-1">पत्रिका जयपुर न्यूज़</p>
        <h1 className="text-2xl md:text-4xl font-bold">पावटा नगर पालिका चुनाव 2026</h1>
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="text-center my-10">
          <h2 className="text-3xl font-bold text-[#1A237E] underline decoration-[#D4AF37] underline-offset-8">
            {wardInfo?.ward_name || `वार्ड नं. ${params.id}`} — जनमत सर्वेक्षण
          </h2>
          <p className="mt-6 text-[#800000] font-bold bg-[#800000]/5 py-2 px-4 rounded border border-[#800000]/20 inline-block">
            यह जनमत सर्वेक्षण केवल वार्ड नं. {wardInfo?.ward_number || params.id} के मतदाताओं के लिए है।
          </p>
        </div>

        {/* Candidate List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {candidates.map((cand) => (
            <div key={cand.id} className="bg-white border border-slate-200 shadow-md group overflow-hidden">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                <img src={cand.photo_url} alt={cand.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-slate-900">{cand.name}</h3>
                <p className="text-[#1A237E] font-medium mb-4">{cand.party_name}</p>
                <button 
                  onClick={() => { setSelected(cand); setIsConfirming(true); }}
                  className="w-full bg-[#800000] text-white py-3 font-bold hover:bg-[#1A237E] transition"
                >
                  वोट करें
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center text-slate-400 text-xs italic border-t pt-8">
          “यह एक अनौपचारिक जनमत सर्वेक्षण है। यह किसी आधिकारिक चुनावी परिणाम का प्रतिनिधित्व नहीं करता।”
        </footer>
      </main>

      {/* Popups & Animations */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 max-w-sm w-full text-center border-t-8 border-[#800000] shadow-2xl">
              <h3 className="text-xl mb-6 font-medium">क्या आप <span className="font-bold text-[#800000]">{selected?.name}</span> को अपना मत देना चाहते हैं?</h3>
              <div className="flex gap-4">
                <button onClick={handleVote} className="flex-1 bg-green-700 text-white py-3 font-bold">हाँ, वोट करें</button>
                <button onClick={() => setIsConfirming(false)} className="flex-1 bg-slate-200 py-3 font-bold">रद्द करें</button>
              </div>
            </div>
          </motion.div>
        )}

        {voted && (
          <motion.div className="fixed inset-0 bg-[#FDFCF0] flex flex-col items-center justify-center z-[100] p-6 text-center">
             <h2 className="text-5xl font-bold text-[#800000] mb-2">मत दर्ज हो गया!</h2>
             <p className="text-xl text-[#1A237E] mb-10">आपने <span className="font-bold">{selected?.name}</span> को अपना मत दिया है।</p>
             <button onClick={() => window.location.href=`/results/${params.id}`} className="bg-[#1A237E] text-white px-10 py-4 font-bold shadow-xl">परिणाम देखें</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
