export async function onRequest(context) {
  const apiUrl = context.env.SECRET_URL;

  try {
    const res = await fetch(apiUrl);
    const data = await res.text(); // kalau JSON pakai .json()

    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Gagal mengambil data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
