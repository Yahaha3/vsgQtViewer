#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(push_constant) uniform PushConstants {
    mat4 projection;
    mat4 modelView;
} pc;

layout(location = 0) in vec3 osg_Vertex;

layout(location = 1) in vec3 osg_Normal;
layout(location = 1) out vec3 normalDir;

layout(location = 2) in vec2 osg_TexCoord0;
layout(location = 2) out vec2 texCoord0;

layout(location = 5) out vec3 viewDir;
layout(location = 6) out vec3 lightDir;

out gl_PerVertex{ vec4 gl_Position; };

void main()
{
    mat4 modelView = pc.modelView;

    gl_Position = (pc.projection * modelView) * vec4(osg_Vertex, 1.0);

    vec3 n = (modelView * vec4(osg_Normal, 0.0)).xyz;
    normalDir = n;
    vec4 lpos = /*osg_LightSource.position*/ vec4(0.0, 0.25, 1.0, 0.0);
    viewDir = -vec3(modelView * vec4(osg_Vertex, 1.0));

    if (lpos.w == 0.0)
        lightDir = lpos.xyz;
    else
        lightDir = lpos.xyz + viewDir;

    texCoord0 = osg_TexCoord0;
}
