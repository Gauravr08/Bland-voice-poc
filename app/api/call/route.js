import axios from 'axios';

export async function POST(req) {
  try {
    const { phoneNumber, task } = await req.json();

    const response = await axios.post(
      'https://api.bland.ai/v1/calls',
      {
        phone_number: phoneNumber,
        task: task || 'Ask the user about their favorite hobby and engage in a friendly conversation.',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BLAND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error initiating call:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: 'Failed to initiate call' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}