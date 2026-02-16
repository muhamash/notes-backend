
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

   
        req.body = await zodSchema.parseAsync( req.body );
        
        console.log( req.body );
        
        next();
    }
    catch ( error )
    {
        next( error );
    }
};