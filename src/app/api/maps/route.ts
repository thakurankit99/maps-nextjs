import { NextRequest, NextResponse } from 'next/server';

// Sample map data
const mapData = {
  defaultMap: "https://app.mappedin.com/map/67af9483845fda000bf299c3",
  exitRoutes: {
    route1: "https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74",
    route2: "https://app.mappedin.com/map/67af9483845fda000bf299c3/directions?floor=m_cdd612a0032a1f74&location=s_3283c146d50c32f2&departure=s_304550fe8b33d93b"
  },
  alternativeViews: {
    healthCenter360: "https://iitm360.ankitthakur.eu.org/?media-index=4",
    slbsgmc: "https://ankitthakur.eu.org/api_slbsgmc"
  },
  locations: [
    {
      id: "entrance",
      name: "Main Entrance",
      coordinates: { x: 100, y: 200 },
      description: "Main entrance to the Health Center"
    },
    {
      id: "reception",
      name: "Reception",
      coordinates: { x: 150, y: 250 },
      description: "Reception and information desk"
    },
    {
      id: "emergency_exit",
      name: "Emergency Exit",
      coordinates: { x: 300, y: 100 },
      description: "Emergency exit route"
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'exit-routes':
        return NextResponse.json({
          exitRoutes: mapData.exitRoutes,
          status: 'success'
        });
      
      case 'alternative-views':
        return NextResponse.json({
          alternativeViews: mapData.alternativeViews,
          status: 'success'
        });
      
      case 'locations':
        return NextResponse.json({
          locations: mapData.locations,
          status: 'success'
        });
      
      default:
        return NextResponse.json({
          ...mapData,
          status: 'success'
        });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'add-location':
        if (!data.id || !data.name || !data.coordinates) {
          return NextResponse.json(
            { error: 'Missing required fields: id, name, coordinates' },
            { status: 400 }
          );
        }
        
        mapData.locations.push({
          id: data.id,
          name: data.name,
          coordinates: data.coordinates,
          description: data.description || ''
        });

        return NextResponse.json({
          message: 'Location added successfully',
          location: data,
          status: 'success'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
