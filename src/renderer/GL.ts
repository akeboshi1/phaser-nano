let gl: WebGLRenderingContext;

function get ()
{
    return gl;
}

function set (context: WebGLRenderingContext)
{
    gl = context;
}

export default {
    get,
    set
}
