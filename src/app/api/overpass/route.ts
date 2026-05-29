import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius = searchParams.get('radius') || '50000'; // 50km default

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat or lon' }, { status: 400 });
  }

  // We are searching for industrial areas, factories, mills, etc.
  const query = `
    [out:json][timeout:25];
    (
      node["landuse"="industrial"](around:${radius},${lat},${lon});
      way["landuse"="industrial"](around:${radius},${lat},${lon});
      relation["landuse"="industrial"](around:${radius},${lat},${lon});
      node["man_made"="works"](around:${radius},${lat},${lon});
      way["man_made"="works"](around:${radius},${lat},${lon});
      relation["man_made"="works"](around:${radius},${lat},${lon});
    );
    out center;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Overpass API:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby industries' }, { status: 500 });
  }
}
