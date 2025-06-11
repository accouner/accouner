// File: functions/api/stock.js

export async function onRequest(context) {
  // 'context.env.SHEET_URL' akan secara otomatis mengambil variabel yang Anda simpan di dasbor Cloudflare
  const sheetUrl = context.env.SHEET_URL;

  // Jika variabel SHEET_URL belum diatur, kirim pesan error.
  if (!sheetUrl) {
    return new Response('Error: SHEET_URL environment variable not set.', {
      status: 500
    });
  }

  try {
    // Worker mengambil data dari URL Google Sheet yang sebenarnya.
    const response = await fetch(sheetUrl);

    if (!response.ok) {
      // Jika gagal mengambil data dari Google, teruskan status errornya.
      return new Response('Error fetching data from Google Sheet.', {
        status: response.status
      });
    }

    // Ambil data CSV dari respons Google.
    const data = await response.text();

    // Siapkan header untuk respons.
    let headers = new Headers({
      'Content-Type': 'text/csv; charset=utf-8',
      // Cache data di server Cloudflare selama 60 detik untuk mengurangi permintaan ke Google.
      'Cache-Control': 's-maxage=60',
    });

    // Kirim data CSV kembali ke browser pengunjung.
    return new Response(data, {
      headers: headers
    });

  } catch (error) {
    return new Response('An unexpected error occurred.', {
      status: 500
    });
  }
}
