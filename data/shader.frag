#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(binding = 0) uniform sampler2D diffuseMap;
layout(binding = 4) uniform sampler2D emissiveMap;

layout(binding = 10) uniform MaterialData
{
    vec4 ambientColor;
    vec4 diffuseColor;
    vec4 specularColor;
    vec4 emissiveColor;
    float shininess;
} material;

layout(location = 1) in vec3 normalDir;
layout(location = 2) in vec2 texCoord0;
layout(location = 5) in vec3 viewDir;
layout(location = 6) in vec3 lightDir;

layout(location = 0) out vec4 outColor;

void main()
{
    vec4 base = texture(diffuseMap, texCoord0.st);
    vec4 emissiveTex = texture(emissiveMap, texCoord0.st);

    //vec4 base = vec4(1.0);
    vec3 ambientColor = material.ambientColor.rgb;
    vec3 diffuseColor = material.diffuseColor.rgb;
    vec3 specularColor = material.specularColor.rgb;
    vec3 emissiveColor = material.emissiveColor.rgb;
    float shininess = material.shininess;

//    vec3 ambientColor = vec3(0.1);
//    vec3 diffuseColor = vec3(0.8);
//    vec3 specularColor = vec3(1.0);
//    float shininess = 32.0;

    vec3 nDir = normalDir;
    vec3 nd = normalize(nDir);
    vec3 ld = normalize(lightDir);
    vec3 vd = normalize(viewDir);
    vec4 color = vec4(0.01, 0.01, 0.01, 1.0);
    color.rgb += ambientColor;
    float diff = max(dot(ld, nd), 0.0);
    color.rgb += diffuseColor * diff;
    color *= base;

    if (diff > 0.0)
    {
        vec3 halfDir = normalize(ld + vd);
        color.rgb += base.a * specularColor *
            pow(max(dot(halfDir, nd), 0.0), shininess);
    }

    outColor = color + vec4(emissiveColor * emissiveTex.rgb, emissiveTex.a);

    if (outColor.a==0.0) 
        discard;
}

