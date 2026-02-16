
export const validateRequest = ( zodSchema ) => async (
    req,
    res,
    next
) =>
{
    try
    {
        if ( req.body?.data )
        {
            req.body = JSON.parse( req.body.data )
        }

        console.log( req.body );
        
        req.body = await zodSchema.parseAsync( req.body );
        next();
    }
    catch ( error )
    {
        next( error );
    }
};