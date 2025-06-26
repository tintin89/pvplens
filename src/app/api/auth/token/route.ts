import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const clientId = process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID;
    const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Blizzard API credentials');
      return NextResponse.json(
        { error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BLIZZARD_OAUTH_URL}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error('Failed to get access token:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to authenticate with Blizzard API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });

  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
