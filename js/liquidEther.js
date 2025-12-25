
(function() {
    'use strict';

    // Configuration - matching the React component defaults
    const CONFIG = {
        mouseForce: 20,
        cursorSize: 100,
        isViscous: false,
        viscous: 30,
        iterationsViscous: 32,
        iterationsPoisson: 32,
        dt: 0.014,
        BFECC: true,
        resolution: 0.5,
        isBounce: false,
        colors: ['#2e7d32', '#81c784', '#a5d6a7'], // Green theme colors
        autoDemo: true,
        autoSpeed: 0.5,
        autoIntensity: 2.2,
        takeoverDuration: 0.25,
        autoResumeDelay: 3000,
        autoRampDuration: 0.6
    };

    let LiquidEtherInstance = null;

    class LiquidEther {
        constructor(container, options = {}) {
            this.config = { ...CONFIG, ...options };
            this.container = container;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.isRunning = false;
            this.rafId = null;
            this.time = 0;
            this.clock = new THREE.Clock();
            
            // Mouse tracking
            this.mouse = {
                coords: new THREE.Vector2(0, 0),
                coordsOld: new THREE.Vector2(0, 0),
                diff: new THREE.Vector2(0, 0),
                isActive: false
            };

            // Auto demo
            this.autoDemo = {
                active: false,
                current: new THREE.Vector2(0, 0),
                target: new THREE.Vector2(),
                lastUserInteraction: performance.now()
            };

            this.init();
        }

        makePaletteTexture(colors) {
            const arr = colors.length === 1 ? [colors[0], colors[0]] : colors;
            const w = arr.length;
            const data = new Uint8Array(w * 4);
            
            for (let i = 0; i < w; i++) {
                const c = new THREE.Color(arr[i]);
                data[i * 4 + 0] = Math.round(c.r * 255);
                data[i * 4 + 1] = Math.round(c.g * 255);
                data[i * 4 + 2] = Math.round(c.b * 255);
                data[i * 4 + 3] = 255;
            }
            
            const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
            tex.magFilter = THREE.LinearFilter;
            tex.minFilter = THREE.LinearFilter;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.generateMipmaps = false;
            tex.needsUpdate = true;
            return tex;
        }

        init() {
            if (!this.container || typeof THREE === 'undefined') {
                console.warn('Liquid Ether: THREE.js not loaded or container not found');
                return;
            }

            // Setup container
            this.container.style.position = 'absolute';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.overflow = 'hidden';
            this.container.style.pointerEvents = 'none';
            this.container.style.zIndex = '0';

            // Get dimensions
            const rect = this.container.getBoundingClientRect();
            this.width = Math.max(1, Math.floor(rect.width));
            this.height = Math.max(1, Math.floor(rect.height));
            this.aspect = this.width / this.height;

            // Create renderer
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
            });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.domElement.style.width = '100%';
            this.renderer.domElement.style.height = '100%';
            this.renderer.domElement.style.display = 'block';
            this.container.appendChild(this.renderer.domElement);

            // Create scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            // Create simplified liquid effect using particles/shaders
            this.createLiquidEffect();

            // Setup event listeners
            this.setupEventListeners();

            // Start animation
            this.start();
        }

        createLiquidEffect() {
            // Simplified version - using particle system with flow
            const particleCount = 2000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            const color1 = new THREE.Color(this.config.colors[0] || '#2e7d32');
            const color2 = new THREE.Color(this.config.colors[1] || '#81c784');
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Position in normalized coordinates (-1 to 1)
                positions[i3] = (Math.random() - 0.5) * 2;
                positions[i3 + 1] = (Math.random() - 0.5) * 2;
                positions[i3 + 2] = 0;
                
                // Color gradient
                const mix = Math.random();
                const color = color1.clone().lerp(color2, mix);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            // Vertex shader for liquid flow effect
            const vertexShader = `
                attribute vec3 position;
                attribute vec3 color;
                uniform float time;
                uniform vec2 mouse;
                uniform float aspect;
                varying vec3 vColor;
                varying vec2 vUv;
                
                vec2 rotate2D(vec2 v, float a) {
                    float s = sin(a);
                    float c = cos(a);
                    mat2 m = mat2(c, -s, s, c);
                    return m * v;
                }
                
                void main() {
                    vColor = color;
                    vec2 pos = position.xy;
                    vec2 mouseDir = normalize(pos - mouse);
                    float dist = distance(pos, mouse);
                    
                    // Flow effect
                    float flow = sin(time * 0.5 + position.x * 3.0 + position.y * 2.0) * 0.02;
                    pos += mouseDir * flow * (1.0 - smoothstep(0.0, 0.5, dist));
                    
                    // Rotation effect
                    pos = rotate2D(pos, time * 0.1);
                    
                    // Aspect ratio correction
                    pos.x /= aspect;
                    
                    gl_Position = vec4(pos, 0.0, 1.0);
                    gl_PointSize = 3.0;
                    vUv = pos;
                }
            `;

            // Fragment shader for smooth particles
            const fragmentShader = `
                precision highp float;
                varying vec3 vColor;
                varying vec2 vUv;
                
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.6; // Overall transparency
                    gl_FragColor = vec4(vColor, alpha);
                }
            `;

            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    time: { value: 0 },
                    mouse: { value: new THREE.Vector2(0, 0) },
                    aspect: { value: this.aspect }
                },
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particles = new THREE.Points(geometry, material);
            this.particles = particles;
            this.scene.add(particles);

            // Add background gradient mesh
            this.createBackgroundGradient();
        }

        createBackgroundGradient() {
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                vertexShader: `
                    void main() {
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    precision highp float;
                    uniform float time;
                    varying vec2 vUv;
                    
                    void main() {
                        vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
                        float gradient = sin(uv.x * 3.14 + time * 0.2) * 0.1 + 0.05;
                        vec3 color1 = vec3(0.18, 0.49, 0.20); // #2e7d32
                        vec3 color2 = vec3(0.51, 0.78, 0.52); // #81c784
                        vec3 color = mix(color1, color2, gradient);
                        gl_FragColor = vec4(color, 0.15);
                    }
                `,
                uniforms: {
                    time: { value: 0 }
                },
                transparent: true
            });
            
            const gradient = new THREE.Mesh(geometry, material);
            this.gradientMesh = gradient;
            this.scene.add(gradient);
        }

        setupEventListeners() {
            // Mouse move
            this.onMouseMove = (e) => {
                if (!this.container) return;
                const rect = this.container.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                
                this.mouse.coordsOld.copy(this.mouse.coords);
                this.mouse.coords.set(x, y);
                this.mouse.diff.subVectors(this.mouse.coords, this.mouse.coordsOld);
                this.mouse.isActive = true;
                this.autoDemo.lastUserInteraction = performance.now();
                this.autoDemo.active = false;
            };

            // Touch move
            this.onTouchMove = (e) => {
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    if (this.onMouseMove) {
                        this.onMouseMove({ clientX: t.clientX, clientY: t.clientY });
                    }
                }
            };

            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('touchmove', this.onTouchMove, { passive: true });
        }

        updateAutoDemo() {
            if (!this.config.autoDemo) return;
            
            const now = performance.now();
            const idle = now - this.autoDemo.lastUserInteraction;
            
            if (idle < this.config.autoResumeDelay) {
                this.autoDemo.active = false;
                return;
            }

            if (!this.autoDemo.active) {
                this.autoDemo.active = true;
                this.autoDemo.current.copy(this.mouse.coords);
                this.autoDemo.target.set(
                    (Math.random() - 0.5) * 1.6,
                    (Math.random() - 0.5) * 1.6
                );
            }

            const dir = new THREE.Vector2().subVectors(this.autoDemo.target, this.autoDemo.current);
            const dist = dir.length();
            
            if (dist < 0.01) {
                this.autoDemo.target.set(
                    (Math.random() - 0.5) * 1.6,
                    (Math.random() - 0.5) * 1.6
                );
                return;
            }

            dir.normalize();
            const step = this.config.autoSpeed * 0.016; // Assuming ~60fps
            this.autoDemo.current.addScaledVector(dir, Math.min(step, dist));
            this.mouse.coords.copy(this.autoDemo.current);
        }

        update() {
            if (!this.isRunning) return;

            const delta = this.clock.getDelta();
            this.time += delta;

            // Update auto demo
            this.updateAutoDemo();

            // Smooth mouse movement
            if (this.particles && this.particles.material) {
                const uniforms = this.particles.material.uniforms;
                uniforms.time.value = this.time;
                uniforms.mouse.value.lerp(this.mouse.coords, 0.1);
                uniforms.aspect.value = this.aspect;
            }

            // Update gradient
            if (this.gradientMesh && this.gradientMesh.material) {
                this.gradientMesh.material.uniforms.time.value = this.time;
            }

            // Render
            this.renderer.render(this.scene, this.camera);
            this.rafId = requestAnimationFrame(() => this.update());
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.clock.start();
            this.update();
        }

        pause() {
            this.isRunning = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }

        resize() {
            if (!this.container) return;
            const rect = this.container.getBoundingClientRect();
            this.width = Math.max(1, Math.floor(rect.width));
            this.height = Math.max(1, Math.floor(rect.height));
            this.aspect = this.width / this.height;
            
            if (this.renderer) {
                this.renderer.setSize(this.width, this.height);
            }
        }

        dispose() {
            this.pause();
            
            if (this.onMouseMove) {
                window.removeEventListener('mousemove', this.onMouseMove);
            }
            if (this.onTouchMove) {
                window.removeEventListener('touchmove', this.onTouchMove);
            }

            if (this.renderer) {
                this.container.removeChild(this.renderer.domElement);
                this.renderer.dispose();
            }
        }
    }

    // Initialize when DOM is ready
    function initLiquidEther() {
        const container = document.getElementById('liquidEtherContainer');
        if (!container) {
            console.warn('Liquid Ether container not found');
            return;
        }

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Liquid Ether: THREE.js library is required. Please include Three.js before this script.');
            return;
        }

        // Wait for container to have dimensions
        const checkSize = setInterval(() => {
            const rect = container.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                clearInterval(checkSize);
                
                if (LiquidEtherInstance) {
                    LiquidEtherInstance.dispose();
                }
                
                LiquidEtherInstance = new LiquidEther(container, {
                    colors: ['#2e7d32', '#81c784', '#a5d6a7'],
                    autoDemo: true,
                    autoSpeed: 0.4
                });

                // Setup resize observer
                const resizeObserver = new ResizeObserver(() => {
                    if (LiquidEtherInstance) {
                        LiquidEtherInstance.resize();
                    }
                });
                resizeObserver.observe(container);

                // Setup intersection observer for performance
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (LiquidEtherInstance) {
                            if (entry.isIntersecting && !document.hidden) {
                                LiquidEtherInstance.start();
                            } else {
                                LiquidEtherInstance.pause();
                            }
                        }
                    });
                }, { threshold: 0.01 });
                io.observe(container);
            }
        }, 100);

        // Cleanup after 5 seconds if container never gets size
        setTimeout(() => clearInterval(checkSize), 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiquidEther);
    } else {
        initLiquidEther();
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (LiquidEtherInstance) {
                LiquidEtherInstance.resize();
            }
        }, 250);
    });

})();

