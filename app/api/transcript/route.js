import axios from 'axios';

export async function POST(req) {
  try {
    const { callId } = await req.json();

    const response = await axios.get(`https://api.bland.ai/v1/calls/${callId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BLAND_API_KEY}`,
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching transcript:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch transcript' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}