export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { event: eventName, page, timestamp } = body;

    console.log('Analytics event:', {
      event: eventName,
      page,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: event.headers['user-agent'],
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for']
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to process analytics' }),
    };
  }
};
