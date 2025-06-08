import { NextRequest, NextResponse } from 'next/server';

// Sample navigation data
const navigationData = {
  routes: [
    {
      id: "route_1",
      from: "entrance",
      to: "reception",
      distance: "50m",
      estimatedTime: "2 minutes",
      instructions: [
        "Enter through the main entrance",
        "Walk straight for 30 meters",
        "Turn right at the corridor",
        "Reception desk will be on your left"
      ]
    },
    {
      id: "route_2",
      from: "reception",
      to: "emergency_exit",
      distance: "120m",
      estimatedTime: "3 minutes",
      instructions: [
        "From reception, head towards the main corridor",
        "Turn left at the first intersection",
        "Continue straight for 80 meters",
        "Emergency exit will be on your right"
      ]
    }
  ],
  emergencyRoutes: [
    {
      id: "emergency_1",
      from: "any_location",
      to: "emergency_exit",
      priority: "high",
      instructions: [
        "🚨 EMERGENCY EXIT ROUTE",
        "Follow the red emergency signs",
        "Do not use elevators",
        "Proceed to nearest emergency exit"
      ]
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const emergency = searchParams.get('emergency');

    if (emergency === 'true') {
      return NextResponse.json({
        routes: navigationData.emergencyRoutes,
        type: 'emergency',
        status: 'success'
      });
    }

    if (from && to) {
      const route = navigationData.routes.find(r => 
        r.from === from && r.to === to
      );

      if (route) {
        return NextResponse.json({
          route,
          status: 'success'
        });
      } else {
        return NextResponse.json({
          message: 'Route not found',
          availableRoutes: navigationData.routes.map(r => ({
            from: r.from,
            to: r.to,
            id: r.id
          })),
          status: 'not_found'
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      routes: navigationData.routes,
      emergencyRoutes: navigationData.emergencyRoutes,
      status: 'success'
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch navigation data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, emergency } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to' },
        { status: 400 }
      );
    }

    // Generate a simple route (in a real app, this would use pathfinding algorithms)
    const newRoute = {
      id: `route_${Date.now()}`,
      from,
      to,
      distance: "estimated",
      estimatedTime: "calculating...",
      instructions: [
        `Navigate from ${from} to ${to}`,
        "Route calculation in progress...",
        "Please wait for detailed instructions"
      ],
      emergency: emergency || false
    };

    return NextResponse.json({
      route: newRoute,
      message: 'Route calculated successfully',
      status: 'success'
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}
