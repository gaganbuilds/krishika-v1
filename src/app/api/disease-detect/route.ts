import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const HF_MODEL_URL =
  'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'HUGGINGFACE_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    // Convert File -> ArrayBuffer -> Node Buffer (raw binary)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Send raw binary to HuggingFace with octet-stream
    const response = await axios.post(HF_MODEL_URL, buffer, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      timeout: 60000,
      // Ensure axios does NOT transform the buffer into JSON
      transformRequest: [(data: any) => data],
    });

    const data = response.data;

    // Handle model loading / sleeping response
    if (data?.error && typeof data.error === 'string' && data.error.includes('loading')) {
      const estimatedTime = data.estimated_time || 30;
      return NextResponse.json(
        {
          error: 'model_loading',
          message: 'AI model is warming up, please wait...',
          estimated_time: estimatedTime,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    const hfData = error.response?.data;

    // HuggingFace returns 503 when model is loading
    if (error.response?.status === 503) {
      const estimatedTime = hfData?.estimated_time || 30;
      return NextResponse.json(
        {
          error: 'model_loading',
          message: 'AI model is warming up, please wait...',
          estimated_time: estimatedTime,
        },
        { status: 503 }
      );
    }

    console.error(
      'Error in disease-detect API:',
      hfData || error.message
    );
    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: hfData?.error || error.message,
      },
      { status: 500 }
    );
  }
}
