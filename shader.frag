#version 150 core

out vec4 out_Color;

uniform vec3 lightPosition;
uniform vec3 cameraPosition;
uniform vec3 diffColor;
uniform vec3 specColor;
uniform float shininess;
uniform sampler2D diffTex;
uniform sampler2D bumpTex;
in vec3 normal;
in vec3 worldPos;
in vec2 texCoord;
 
 mat3 getTBN(vec3 N) {
	vec3 Q1 = dFdx(worldPos), Q2 = dFdy(worldPos);
	vec2 st1 = dFdx(texCoord), st2 = dFdy(texCoord);
	float D = st1.s*st2.t-st2.s*st1.t;
	return mat3(normalize((Q1*st2.t-Q2*st1.t)*D), 
				normalize((-Q1*st2.s+Q2*st1.s)*D), N);
 }

void main(void)
{
	vec3 toLight = lightPosition-worldPos;
	vec3 L = normalize(toLight);
	vec3 N = normalize(normal);

	float Bu = texture(bumpTex, texCoord+vec2(0.00001, 0)).r - texture(bumpTex, texCoord-vec2(0.00001, 0)).r;
	float Bv = texture(bumpTex, texCoord+vec2(0, 0.00001)).r - texture(bumpTex, texCoord-vec2(0, 0.00001)).r;
	vec3 bumpVec = vec3(-Bu*100, Bv*100, 1);
	mat3 tbn = getTBN(N);
	N = normalize(tbn*bumpVec);

	vec3 V = normalize(cameraPosition-worldPos);
	vec3 R = reflect(-L, N);
	vec3 Ii = vec3(200, 200, 200)/dot(toLight, toLight);
	vec3 dColor = texture(diffTex, texCoord).xyz;
	vec3 color = Ii*(dColor*max(0, dot(N, L)) + specColor*pow(max(0, dot(R, V)), shininess));
	out_Color = vec4(pow(color, vec3(1/2.2)), 1.0);
} 