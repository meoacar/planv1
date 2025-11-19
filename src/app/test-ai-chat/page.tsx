'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestAIChatPage() {
  const [message, setMessage] = useState('Merhaba, nasılsın?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message }
          ]
        })
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
      } else {
        setError(JSON.stringify(data.error, null, 2));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">🤖 AI Chat API Test</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Mesajı:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Mesajınızı yazın..."
          />
        </div>

        <Button onClick={testAPI} disabled={loading} className="w-full">
          {loading ? 'Test Ediliyor...' : 'API\'yi Test Et'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❌ Hata:</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Yanıt:</h3>
            <p className="text-green-700">{response}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Bilgi:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Bu sayfa AI Chat API'sini test eder</li>
            <li>• Giriş yapmış olmanız gerekiyor</li>
            <li>• Gemini API key geçerliyse gerçek AI yanıtı alırsınız</li>
            <li>• Gemini çalışmazsa mock yanıt döner</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
