'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetch() {
      // यहाँ 'ward_results' वह SQL View है जो आपने पहले बनाई थी
      const { data } = await supabase.from('ward_results').select('*').eq('ward_id', params.id).order('total_votes', { ascending: false });
      if (data) {
        setResults(data);
        setTotal(data.reduce((acc: number, curr: any) => acc + curr.total_votes, 0));
      }
    }
    fetch();
  }, [params.id]);

  return (
    <div className="bg-[#FDFCF0] min-h-screen">
      <header className="bg-[#1A237E] text-white p-6 text-center border-b-4 border-[#D4AF37]">
        <h1 className="text-3xl font-bold">जनमत सर्वेक्षण — वर्तमान स्थिति</h1>
        <p className="mt-2 opacity-80">कुल दर्ज मत: {total}</p>
      </header>
      <main className="max-w-3xl mx-auto p-4 mt-10">
        <div className="space-y-10">
          {results.map((c, idx) => {
            const pct = total > 0 ? ((c.total_votes / total) * 100).toFixed(1) : 0;
            return (
              <div key={c.candidate_id} className="bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="text-4xl font-bold text-gray-200">{idx + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between font-bold mb-2">
                    <span className="text-xl">{c.name} ({c.party_name})</span>
                    <span className="text-[#800000]">{c.total_votes} वोट ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden border">
                    <div className="bg-[#800000] h-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
