const ipRequests = {}; 
const rateLimitWindowMs = 60 * 1000; 
const maxRequestsPerWindow = 5;

export const rateLimitMiddleware = ( req, res, next ) =>
{
    const ip = req.socket.remoteAddress || req.ip;
    const currentTime = Date.now();

    if ( !ipRequests[ ip ] )
    {
        ipRequests[ ip ] = [];
    }

    ipRequests[ ip ] = ipRequests[ ip ].filter(
        ( timestamp ) => currentTime - timestamp < rateLimitWindowMs
    );

    const requestCount = ipRequests[ ip ].length;

    if ( requestCount >= maxRequestsPerWindow )
    {
        const retryAfter = Math.ceil(
            ( rateLimitWindowMs - ( currentTime - ipRequests[ ip ][ 0 ] ) ) / 1000
        );
        res.status( 429 ).set( {
            "Content-Type": "text/plain",
            "Retry-After": retryAfter,
        } );
        return res.send( `Too many requests. Try again in ${retryAfter} seconds.` );
    }

    ipRequests[ ip ].push( currentTime );
    
    next();
};