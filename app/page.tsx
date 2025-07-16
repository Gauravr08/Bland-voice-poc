'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [task, setTask] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callId, setCallId] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleCall = async () => {
    setIsLoading(true);
    setCallStatus('');
    try {
      const response = await axios.post('/api/call', {
        phoneNumber,
        task,
      });
      const newCallId = response.data.call_id;
      setCallStatus(`✅ Call started! Call ID: ${newCallId}`);
      setCallId(newCallId);
    } catch (error) {
      setCallStatus('❌ Error initiating call. Please check the number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTranscript = async () => {
  setIsLoading(true);
  setTranscript('');

  try {
    const response = await axios.post('/api/transcript', { callId });

    console.log('🟢 Transcript response:', response.data);

    let transcriptData = '';

    // ✅ FIXED: Correct key from your API response
    if (response.data.concatenated_transcript) {
      transcriptData = response.data.concatenated_transcript;
    } else if (Array.isArray(response.data.transcripts)) {
      // fallback: join all transcript text lines
      transcriptData = response.data.transcripts.map(t => `${t.user}: ${t.text}`).join('\n');
    } else {
      transcriptData = '⚠️ No transcript available.';
    }

    setTranscript(transcriptData);
    console.log('✅ Final transcript set:', transcriptData);
  } catch (error) {
    console.error('❌ Transcript error:', error.response?.data || error.message);
    setTranscript(`❌ Error fetching transcript for Call ID ${callId}.`);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    console.log('Transcript state updated:', transcript);
  }, [transcript]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          📞 Bland AI Voice Call PoC
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Call Section */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="block mt-4 mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Task (Prompt)</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Ask about their favorite hobby"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleCall}
              disabled={isLoading || !phoneNumber}
              className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
                isLoading || !phoneNumber ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '📲 Initiating Call...' : 'Start Call'}
            </button>

            {callStatus && (
              <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">{callStatus}</p>
            )}
          </div>

          {/* Transcript Section */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Call ID</label>
            <input
              type="text"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              placeholder="Enter Call ID"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleFetchTranscript}
              disabled={isLoading || !callId}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
                isLoading || !callId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? '📝 Fetching Transcript...' : 'Fetch Transcript'}
            </button>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Transcript:</label>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded h-40 overflow-y-auto text-sm text-gray-800 dark:text-white">
                {transcript || 'No transcript yet'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}