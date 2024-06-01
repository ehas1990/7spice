"use strict";const canvas=document.getElementsByTagName("canvas")[0];canvas.width=canvas.clientWidth,canvas.height=canvas.clientHeight;let config={SIM_RESOLUTION:128,DYE_RESOLUTION:512,DENSITY_DISSIPATION:.97,VELOCITY_DISSIPATION:.98,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.1,SHADING:!1,COLORFUL:!1,PAUSED:!1,BACK_COLOR:{r:2,g:3,b:15},TRANSPARENT:!1,BLOOM:!1,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7};function pointerPrototype(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let pointers=[],splatStack=[],bloomFramebuffers=[];pointers.push(new pointerPrototype);const{gl:e,ext:r}=getWebGLContext(canvas);function getWebGLContext(e){let r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},i=e.getContext("webgl2",r),t=!!i;t||(i=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let o,a;t?(i.getExtension("EXT_color_buffer_float"),a=i.getExtension("OES_texture_float_linear")):(o=i.getExtension("OES_texture_half_float"),a=i.getExtension("OES_texture_half_float_linear")),i.clearColor(0,0,0,1);let n=t?i.HALF_FLOAT:o.HALF_FLOAT_OES,u,l,m;return t?(u=getSupportedFormat(i,i.RGBA16F,i.RGBA,n),l=getSupportedFormat(i,i.RG16F,i.RG,n),m=getSupportedFormat(i,i.R16F,i.RED,n)):(u=getSupportedFormat(i,i.RGBA,i.RGBA,n),l=getSupportedFormat(i,i.RGBA,i.RGBA,n),m=getSupportedFormat(i,i.RGBA,i.RGBA,n)),null==u?ga("send","event",t?"webgl2":"webgl","not supported"):ga("send","event",t?"webgl2":"webgl","supported"),{gl:i,ext:{formatRGBA:u,formatRG:l,formatR:m,halfFloatTexType:n,supportLinearFiltering:a}}}function getSupportedFormat(e,r,i,t){if(!supportRenderTextureFormat(e,r,i,t))switch(r){case e.R16F:return getSupportedFormat(e,e.RG16F,e.RG,t);case e.RG16F:return getSupportedFormat(e,e.RGBA16F,e.RGBA,t);default:return null}return{internalFormat:r,format:i}}function supportRenderTextureFormat(e,r,i,t){let o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,t,null);let a=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);let n=e.checkFramebufferStatus(e.FRAMEBUFFER);return n==e.FRAMEBUFFER_COMPLETE}function startGUI(){var e=new dat.GUI({width:300});e.add(config,"SIM_RESOLUTION",{32:32,64:64,128:128,256:256}).name("sim resolution").onFinishChange(initFramebuffers),e.add(config,"DYE_RESOLUTION",{128:128,256:256,512:512,1024:1024}).name("dye resolution").onFinishChange(initFramebuffers),e.add(config,"DENSITY_DISSIPATION",.9,1).name("density diffusion"),e.add(config,"VELOCITY_DISSIPATION",.9,1).name("velocity diffusion"),e.add(config,"PRESSURE_DISSIPATION",0,1).name("pressure diffusion"),e.add(config,"CURL",0,50).name("vorticity").step(1),e.add(config,"SPLAT_RADIUS",.01,1).name("splat radius"),e.add(config,"SHADING").name("shading"),e.add(config,"COLORFUL").name("colorful"),e.add(config,"PAUSED").name("paused").listen(),e.add({fun(){splatStack.push(parseInt(20*Math.random())+5)}},"fun").name("Random splats");let r=e.addFolder("Bloom");r.add(config,"BLOOM").name("enabled"),r.add(config,"BLOOM_INTENSITY",.1,2).name("intensity"),r.add(config,"BLOOM_THRESHOLD",0,1).name("threshold");let i=e.addFolder("Capture");i.addColor(config,"BACK_COLOR").name("background color"),i.add(config,"TRANSPARENT").name("transparent"),i.add({fun:captureScreenshot},"fun").name("take screenshot"),isMobile()&&e.close()}function captureScreenshot(){colorProgram.bind(),e.uniform4f(colorProgram.uniforms.color,0,0,0,1),blit(density.write.fbo),render(density.write.fbo),e.bindFramebuffer(e.FRAMEBUFFER,density.write.fbo);let r=dyeWidth*dyeHeight*4,i=new Float32Array(r);e.readPixels(0,0,dyeWidth,dyeHeight,e.RGBA,e.FLOAT,i);let t=new Uint8Array(r),o=0;for(let a=dyeHeight-1;a>=0;a--)for(let n=0;n<dyeWidth;n++){let u=a*dyeWidth*4+4*n;t[u+0]=255*clamp01(i[o+0]),t[u+1]=255*clamp01(i[o+1]),t[u+2]=255*clamp01(i[o+2]),t[u+3]=255*clamp01(i[o+3]),o+=4}let l=document.createElement("canvas"),m=l.getContext("2d");l.width=dyeWidth,l.height=dyeHeight;let c=m.createImageData(dyeWidth,dyeHeight);c.data.set(t),m.putImageData(c,0,0);let s=l.toDataURL();downloadURI("fluid.png",s),URL.revokeObjectURL(s)}function clamp01(e){return Math.min(Math.max(e,0),1)}function isMobile(){return/Mobi|Android/i.test(navigator.userAgent)}isMobile()&&(config.SHADING=!1),r.supportLinearFiltering||(config.SHADING=!1,config.BLOOM=!1);class GLProgram{constructor(r,i){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,r),e.attachShader(this.program,i),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);let t=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let o=0;o<t;o++){let a=e.getActiveUniform(this.program,o).name;this.uniforms[a]=e.getUniformLocation(this.program,a)}}bind(){e.useProgram(this.program)}}function compileShader(r,i){let t=e.createShader(r);if(e.shaderSource(t,i),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw e.getShaderInfoLog(t);return t}const baseVertexShader=compileShader(e.VERTEX_SHADER,`
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),clearShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),colorShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`),backgroundShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float aspectRatio;

    #define SCALE 25.0

    void main () {
        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
        float v = mod(uv.x + uv.y, 2.0);
        v = v * 0.1 + 0.8;
        gl_FragColor = vec4(vec3(v), 1.0);
    }
`),displayShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        vec3 C = texture2D(uTexture, vUv).rgb;
        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
    }
`),displayBloomShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;

    void main () {
        vec3 C = texture2D(uTexture, vUv).rgb;
        vec3 bloom = texture2D(uBloom, vUv).rgb;
        vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 800.0;
        bloom = pow(bloom.rgb, vec3(1.0 / 2.2));
        C += bloom;
        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
    }
`),displayShadingShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;

    void main () {
        vec3 L = texture2D(uTexture, vL).rgb;
        vec3 R = texture2D(uTexture, vR).rgb;
        vec3 T = texture2D(uTexture, vT).rgb;
        vec3 B = texture2D(uTexture, vB).rgb;
        vec3 C = texture2D(uTexture, vUv).rgb;

        float dx = length(R) - length(L);
        float dy = length(T) - length(B);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        C.rgb *= diffuse;

        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
    }
`),displayBloomShadingShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    void main () {
        vec3 L = texture2D(uTexture, vL).rgb;
        vec3 R = texture2D(uTexture, vR).rgb;
        vec3 T = texture2D(uTexture, vT).rgb;
        vec3 B = texture2D(uTexture, vB).rgb;
        vec3 C = texture2D(uTexture, vUv).rgb;

        float dx = length(R) - length(L);
        float dy = length(T) - length(B);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        C *= diffuse;

        vec3 bloom = texture2D(uBloom, vUv).rgb;
        vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 800.0;
        bloom = pow(bloom.rgb, vec3(1.0 / 2.2));
        C += bloom;

        float a = max(C.r, max(C.g, C.b));
        gl_FragColor = vec4(C, a);
    }
`),bloomPrefilterShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
`),bloomBlurShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
`),bloomFinalShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
`),splatShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`),advectionManualFilteringShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;

        vec2 iuv = floor(st);
        vec2 fuv = fract(st);

        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
        gl_FragColor.a = 1.0;
    }
`),advectionShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`),divergenceShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`),curlShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`),vorticityShader=compileShader(e.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`),pressureShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    vec2 boundary (vec2 uv) {
        return uv;
        // uncomment if you use wrap or repeat texture mode
        // uv = min(max(uv, 0.0), 1.0);
        // return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`),gradientSubtractShader=compileShader(e.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    vec2 boundary (vec2 uv) {
        return uv;
        // uv = min(max(uv, 0.0), 1.0);
        // return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`),blit=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),r=>{e.bindFramebuffer(e.FRAMEBUFFER,r),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let simWidth,simHeight,dyeWidth,dyeHeight,density,velocity,divergence,curl,pressure,bloom;const clearProgram=new GLProgram(baseVertexShader,clearShader),colorProgram=new GLProgram(baseVertexShader,colorShader),backgroundProgram=new GLProgram(baseVertexShader,backgroundShader),displayProgram=new GLProgram(baseVertexShader,displayShader),displayBloomProgram=new GLProgram(baseVertexShader,displayBloomShader),displayShadingProgram=new GLProgram(baseVertexShader,displayShadingShader),displayBloomShadingProgram=new GLProgram(baseVertexShader,displayBloomShadingShader),bloomPrefilterProgram=new GLProgram(baseVertexShader,bloomPrefilterShader),bloomBlurProgram=new GLProgram(baseVertexShader,bloomBlurShader),bloomFinalProgram=new GLProgram(baseVertexShader,bloomFinalShader),splatProgram=new GLProgram(baseVertexShader,splatShader),advectionProgram=new GLProgram(baseVertexShader,r.supportLinearFiltering?advectionShader:advectionManualFilteringShader),divergenceProgram=new GLProgram(baseVertexShader,divergenceShader),curlProgram=new GLProgram(baseVertexShader,curlShader),vorticityProgram=new GLProgram(baseVertexShader,vorticityShader),pressureProgram=new GLProgram(baseVertexShader,pressureShader),gradienSubtractProgram=new GLProgram(baseVertexShader,gradientSubtractShader);function initFramebuffers(){let i=getResolution(config.SIM_RESOLUTION),t=getResolution(config.DYE_RESOLUTION);simWidth=i.width,simHeight=i.height,dyeWidth=t.width,dyeHeight=t.height;let o=r.halfFloatTexType,a=r.formatRGBA,n=r.formatRG,u=r.formatR,l=r.supportLinearFiltering?e.LINEAR:e.NEAREST;density=null==density?createDoubleFBO(dyeWidth,dyeHeight,a.internalFormat,a.format,o,l):resizeDoubleFBO(density,dyeWidth,dyeHeight,a.internalFormat,a.format,o,l),velocity=null==velocity?createDoubleFBO(simWidth,simHeight,n.internalFormat,n.format,o,l):resizeDoubleFBO(velocity,simWidth,simHeight,n.internalFormat,n.format,o,l),divergence=createFBO(simWidth,simHeight,u.internalFormat,u.format,o,e.NEAREST),curl=createFBO(simWidth,simHeight,u.internalFormat,u.format,o,e.NEAREST),pressure=createDoubleFBO(simWidth,simHeight,u.internalFormat,u.format,o,e.NEAREST),initBloomFramebuffers()}function initBloomFramebuffers(){let i=getResolution(config.BLOOM_RESOLUTION),t=r.halfFloatTexType,o=r.formatRGBA,a=r.supportLinearFiltering?e.LINEAR:e.NEAREST;bloom=createFBO(i.width,i.height,o.internalFormat,o.format,t,a),bloomFramebuffers.length=0;for(let n=0;n<config.BLOOM_ITERATIONS;n++){let u=i.width>>n+1,l=i.height>>n+1;if(u<2||l<2)break;let m=createFBO(u,l,o.internalFormat,o.format,t,a);bloomFramebuffers.push(m)}}function createFBO(r,i,t,o,a,n){e.activeTexture(e.TEXTURE0);let u=e.createTexture();e.bindTexture(e.TEXTURE_2D,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,r,i,0,o,a,null);let l=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,l),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,u,0),e.viewport(0,0,r,i),e.clear(e.COLOR_BUFFER_BIT),{texture:u,fbo:l,width:r,height:i,attach:r=>(e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,u),r)}}function createDoubleFBO(e,r,i,t,o,a){let n=createFBO(e,r,i,t,o,a),u=createFBO(e,r,i,t,o,a);return{get read(){return n},set read(value){n=value},get write(){return u},set write(value){u=value},swap(){let e=n;n=u,u=e}}}function resizeFBO(r,i,t,o,a,n,u){let l=createFBO(i,t,o,a,n,u);return clearProgram.bind(),e.uniform1i(clearProgram.uniforms.uTexture,r.attach(0)),e.uniform1f(clearProgram.uniforms.value,1),blit(l.fbo),l}function resizeDoubleFBO(e,r,i,t,o,a,n){return e.read=resizeFBO(e.read,r,i,t,o,a,n),e.write=createFBO(r,i,t,o,a,n),e}function createTextureAsync(r){let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texImage2D(e.TEXTURE_2D,0,e.RGB,1,1,0,e.RGB,e.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let t={texture:i,width:1,height:1,attach:r=>(e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,i),r)},o=new Image;return o.onload=()=>{t.width=o.width,t.height=o.height,e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGB,e.RGB,e.UNSIGNED_BYTE,o)},o.src=r,t}initFramebuffers(),multipleSplats(parseInt(20*Math.random())+5);let lastColorChangeTime=Date.now();function update(){resizeCanvas(),input(),config.PAUSED||step(.016),render(null),requestAnimationFrame(update)}function input(){splatStack.length>0&&multipleSplats(splatStack.pop());for(let e=0;e<pointers.length;e++){let r=pointers[e];r.moved&&(splat(r.x,r.y,r.dx,r.dy,r.color),r.moved=!1)}if(config.COLORFUL&&lastColorChangeTime+100<Date.now()){lastColorChangeTime=Date.now();for(let i=0;i<pointers.length;i++){let t=pointers[i];t.color=generateColor()}}}function step(i){e.disable(e.BLEND),e.viewport(0,0,simWidth,simHeight),curlProgram.bind(),e.uniform2f(curlProgram.uniforms.texelSize,1/simWidth,1/simHeight),e.uniform1i(curlProgram.uniforms.uVelocity,velocity.read.attach(0)),blit(curl.fbo),vorticityProgram.bind(),e.uniform2f(vorticityProgram.uniforms.texelSize,1/simWidth,1/simHeight),e.uniform1i(vorticityProgram.uniforms.uVelocity,velocity.read.attach(0)),e.uniform1i(vorticityProgram.uniforms.uCurl,curl.attach(1)),e.uniform1f(vorticityProgram.uniforms.curl,config.CURL),e.uniform1f(vorticityProgram.uniforms.dt,i),blit(velocity.write.fbo),velocity.swap(),divergenceProgram.bind(),e.uniform2f(divergenceProgram.uniforms.texelSize,1/simWidth,1/simHeight),e.uniform1i(divergenceProgram.uniforms.uVelocity,velocity.read.attach(0)),blit(divergence.fbo),clearProgram.bind(),e.uniform1i(clearProgram.uniforms.uTexture,pressure.read.attach(0)),e.uniform1f(clearProgram.uniforms.value,config.PRESSURE_DISSIPATION),blit(pressure.write.fbo),pressure.swap(),pressureProgram.bind(),e.uniform2f(pressureProgram.uniforms.texelSize,1/simWidth,1/simHeight),e.uniform1i(pressureProgram.uniforms.uDivergence,divergence.attach(0));for(let t=0;t<config.PRESSURE_ITERATIONS;t++)e.uniform1i(pressureProgram.uniforms.uPressure,pressure.read.attach(1)),blit(pressure.write.fbo),pressure.swap();gradienSubtractProgram.bind(),e.uniform2f(gradienSubtractProgram.uniforms.texelSize,1/simWidth,1/simHeight),e.uniform1i(gradienSubtractProgram.uniforms.uPressure,pressure.read.attach(0)),e.uniform1i(gradienSubtractProgram.uniforms.uVelocity,velocity.read.attach(1)),blit(velocity.write.fbo),velocity.swap(),advectionProgram.bind(),e.uniform2f(advectionProgram.uniforms.texelSize,1/simWidth,1/simHeight),r.supportLinearFiltering||e.uniform2f(advectionProgram.uniforms.dyeTexelSize,1/simWidth,1/simHeight);let o=velocity.read.attach(0);e.uniform1i(advectionProgram.uniforms.uVelocity,o),e.uniform1i(advectionProgram.uniforms.uSource,o),e.uniform1f(advectionProgram.uniforms.dt,i),e.uniform1f(advectionProgram.uniforms.dissipation,config.VELOCITY_DISSIPATION),blit(velocity.write.fbo),velocity.swap(),e.viewport(0,0,dyeWidth,dyeHeight),r.supportLinearFiltering||e.uniform2f(advectionProgram.uniforms.dyeTexelSize,1/dyeWidth,1/dyeHeight),e.uniform1i(advectionProgram.uniforms.uVelocity,velocity.read.attach(0)),e.uniform1i(advectionProgram.uniforms.uSource,density.read.attach(1)),e.uniform1f(advectionProgram.uniforms.dissipation,config.DENSITY_DISSIPATION),blit(density.write.fbo),density.swap()}function render(r){config.BLOOM&&applyBloom(density.read,bloom),null!=r&&config.TRANSPARENT?e.disable(e.BLEND):(e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.enable(e.BLEND));let i=null==r?e.drawingBufferWidth:dyeWidth,t=null==r?e.drawingBufferHeight:dyeHeight;if(e.viewport(0,0,i,t),!config.TRANSPARENT){colorProgram.bind();let o=config.BACK_COLOR;e.uniform4f(colorProgram.uniforms.color,o.r/255,o.g/255,o.b/255,1),blit(r)}if(null==r&&config.TRANSPARENT&&(backgroundProgram.bind(),e.uniform1f(backgroundProgram.uniforms.aspectRatio,canvas.width/canvas.height),blit(null)),config.SHADING){let a=config.BLOOM?displayBloomShadingProgram:displayShadingProgram;a.bind(),e.uniform2f(a.uniforms.texelSize,1/i,1/t),e.uniform1i(a.uniforms.uTexture,density.read.attach(0)),config.BLOOM&&(e.uniform1i(a.uniforms.uBloom,bloom.attach(1)),e.uniform2f(a.uniforms.ditherScale,scale.x,scale.y))}else{let n=config.BLOOM?displayBloomProgram:displayProgram;n.bind(),e.uniform1i(n.uniforms.uTexture,density.read.attach(0)),config.BLOOM&&(e.uniform1i(n.uniforms.uBloom,bloom.attach(1)),e.uniform2f(n.uniforms.ditherScale,scale.x,scale.y))}blit(r)}function applyBloom(r,i){if(bloomFramebuffers.length<2)return;let t=i;e.disable(e.BLEND),bloomPrefilterProgram.bind();let o=config.BLOOM_THRESHOLD*config.BLOOM_SOFT_KNEE+1e-4,a=config.BLOOM_THRESHOLD-o;e.uniform3f(bloomPrefilterProgram.uniforms.curve,a,2*o,.25/o),e.uniform1f(bloomPrefilterProgram.uniforms.threshold,config.BLOOM_THRESHOLD),e.uniform1i(bloomPrefilterProgram.uniforms.uTexture,r.attach(0)),e.viewport(0,0,t.width,t.height),blit(t.fbo),bloomBlurProgram.bind();for(let n=0;n<bloomFramebuffers.length;n++){let u=bloomFramebuffers[n];e.uniform2f(bloomBlurProgram.uniforms.texelSize,1/t.width,1/t.height),e.uniform1i(bloomBlurProgram.uniforms.uTexture,t.attach(0)),e.viewport(0,0,u.width,u.height),blit(u.fbo),t=u}e.blendFunc(e.ONE,e.ONE),e.enable(e.BLEND);for(let l=bloomFramebuffers.length-2;l>=0;l--){let m=bloomFramebuffers[l];e.uniform2f(bloomBlurProgram.uniforms.texelSize,1/t.width,1/t.height),e.uniform1i(bloomBlurProgram.uniforms.uTexture,t.attach(0)),e.viewport(0,0,m.width,m.height),blit(m.fbo),t=m}e.disable(e.BLEND),bloomFinalProgram.bind(),e.uniform2f(bloomFinalProgram.uniforms.texelSize,1/t.width,1/t.height),e.uniform1i(bloomFinalProgram.uniforms.uTexture,t.attach(0)),e.uniform1f(bloomFinalProgram.uniforms.intensity,config.BLOOM_INTENSITY),e.viewport(0,0,i.width,i.height),blit(i.fbo)}function splat(r,i,t,o,a){e.viewport(0,0,simWidth,simHeight),splatProgram.bind(),e.uniform1i(splatProgram.uniforms.uTarget,velocity.read.attach(0)),e.uniform1f(splatProgram.uniforms.aspectRatio,canvas.width/canvas.height),e.uniform2f(splatProgram.uniforms.point,r/canvas.width,1-i/canvas.height),e.uniform3f(splatProgram.uniforms.color,t,-o,1),e.uniform1f(splatProgram.uniforms.radius,config.SPLAT_RADIUS/100),blit(velocity.write.fbo),velocity.swap(),e.viewport(0,0,dyeWidth,dyeHeight),e.uniform1i(splatProgram.uniforms.uTarget,density.read.attach(0)),e.uniform3f(splatProgram.uniforms.color,a.r,a.g,a.b),blit(density.write.fbo),density.swap()}function multipleSplats(e){for(let r=0;r<e;r++){let i=generateColor();i.r*=10,i.g*=10,i.b*=10;let t=canvas.width*Math.random(),o=canvas.height*Math.random(),a=1e3*(Math.random()-.5),n=1e3*(Math.random()-.5);splat(t,o,a,n,i)}}function resizeCanvas(){(canvas.width!=canvas.clientWidth||canvas.height!=canvas.clientHeight)&&(canvas.width=canvas.clientWidth,canvas.height=canvas.clientHeight,initFramebuffers())}function generateColor(){return{r:.8,g:.8,b:.8}}function HSVtoRGB(e,r,i){let t,o,a,n,u,l,m,c;switch(n=Math.floor(6*e),u=6*e-n,l=i*(1-r),m=i*(1-u*r),c=i*(1-(1-u)*r),n%6){case 0:t=i,o=c,a=l;break;case 1:t=m,o=i,a=l;break;case 2:t=l,o=i,a=c;break;case 3:t=l,o=m,a=i;break;case 4:t=c,o=l,a=i;break;case 5:t=i,o=l,a=m}return{r:t,g:o,b:a}}function getResolution(r){let i=e.drawingBufferWidth/e.drawingBufferHeight;i<1&&(i=1/i);let t=Math.round(r*i),o=Math.round(r);return e.drawingBufferWidth>e.drawingBufferHeight?{width:t,height:o}:{width:o,height:t}}function getTextureScale(e,r,i){return{x:r/e.width,y:i/e.height}}update(),document.body.addEventListener("mousemove",e=>{pointers[0].moved=pointers[0].down,pointers[0].dx=(e.clientX-pointers[0].x)*5,pointers[0].dy=(e.clientY-pointers[0].y)*5,pointers[0].x=e.clientX,pointers[0].y=e.clientY}),document.body.addEventListener("mousemove",()=>{pointers[0].down=!0,pointers[0].color=generateColor()});