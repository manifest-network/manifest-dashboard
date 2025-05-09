import {json} from "@sveltejs/kit";

export async function GET() {
  let data = {}
  try {
    const raw = await fetch('https://talib.liftedinit.app/api/v1/metrics/mfxpowerconversion/current');
    if (!raw.ok) throw new Error(`API request failed with status ${raw.status}`);
    data = await raw.json();
  } catch (error) {
    console.error(`Error fetching data:`, error);
    return {data}
  }
  return json(data);
}