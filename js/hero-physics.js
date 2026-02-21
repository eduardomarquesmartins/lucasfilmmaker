
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // --- Matter.js Aliases ---
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

    // --- Engine Setup ---
    const engine = Engine.create();
    const world = engine.world;

    // Set gravity
    engine.gravity.y = 0.8;

    // --- Renderer Setup ---
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    // --- Boundaries ---
    let ground, leftWall, rightWall;

    function createBoundaries() {
        if (ground) Composite.remove(world, [ground, leftWall, rightWall]);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const wallThickness = 60;

        // Mobile Adjustment: Raise the floor to ensure pile-up is visible above browser UI
        const isMobile = window.innerWidth < 768;
        const groundOffset = isMobile ? 80 : 10; // Adjusted to 80px (was 120, too high)

        ground = Bodies.rectangle(width / 2, height + wallThickness / 2 - groundOffset, width, wallThickness, {
            isStatic: true,
            render: { visible: false }
        });

        leftWall = Bodies.rectangle(0 - wallThickness, height / 2, wallThickness, height * 2, {
            isStatic: true,
            render: { visible: false }
        });

        rightWall = Bodies.rectangle(width + wallThickness, height / 2, wallThickness, height * 2, {
            isStatic: true,
            render: { visible: false }
        });

        Composite.add(world, [ground, leftWall, rightWall]);
    }

    createBoundaries();

    // --- Texture Helpers ---
    function createTexture(size, drawFn) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;
        ctx.translate(cx, cy);
        drawFn(ctx, size);
        return c.toDataURL();
    }

    // --- 1. Top-Down Drone Texture ---
    const droneTexture = createTexture(120, (ctx, size) => {
        // Style Constants
        const colorBody = '#E5E5E5';
        const colorStripeFront = '#D35400';
        const colorStripeBack = '#7F8C8D';
        const colorBlade = '#FFFFFF';

        // Arms
        const armW = size * 0.12;
        const armL = size * 0.45;

        function drawArm(angle, stripeColor) {
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = colorBody;
            ctx.beginPath();
            ctx.roundRect(-armW / 2, 0, armW, armL, 5);
            ctx.fill();
            ctx.fillStyle = stripeColor;
            ctx.beginPath();
            ctx.roundRect(-armW / 2, armL * 0.5, armW, armL * 0.3, 2);
            ctx.fill();
            ctx.restore();
        }

        drawArm(Math.PI / 4, colorStripeFront);
        drawArm(-Math.PI / 4, colorStripeFront);
        drawArm(3 * Math.PI / 4, colorStripeBack);
        drawArm(-3 * Math.PI / 4, colorStripeBack);

        // Propellers
        function drawProp(x, y) {
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = colorBlade;
            const bladeLen = size * 0.25;
            const bladeWidth = size * 0.08;
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.beginPath();
                ctx.roundRect(-bladeWidth / 2, 0, bladeWidth, bladeLen, 5);
                ctx.fill();
            }
            ctx.strokeStyle = '#D35400';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, bladeLen + 4, Math.PI * 0.1, Math.PI * 0.9);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, bladeLen + 4, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();
            ctx.fillStyle = '#E67E22';
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const dist = size * 0.35;
        drawProp(dist, dist);
        drawProp(-dist, dist);
        drawProp(dist, -dist);
        drawProp(-dist, -dist);

        // Body
        ctx.fillStyle = colorBody;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#BDC3C7';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#D35400';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
    });

    // --- 2. Camera 1: Modern DSLR (LIGHTENED) ---
    const camera1Texture = createTexture(100, (ctx, size) => {
        const s = size * 0.8;
        // Body (Changed from #222 to #7f8c8d - Concrete Grey)
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.roundRect(-s * 0.5, -s * 0.35, s, s * 0.7, 8); // Main block
        ctx.fill();

        // Grip (Darker grey)
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.roundRect(-s * 0.55, -s * 0.3, s * 0.2, s * 0.6, 5);
        ctx.fill();

        // Prism Hump
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, -s * 0.35);
        ctx.lineTo(-s * 0.1, -s * 0.48);
        ctx.lineTo(s * 0.1, -s * 0.48);
        ctx.lineTo(s * 0.2, -s * 0.35);
        ctx.fill();

        // Lens Ring (Silver)
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
        ctx.fill();

        // Lens Glass
        ctx.fillStyle = '#2c3e50'; // Dark Blueish Grey
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Lens Reflection
        ctx.fillStyle = '#85c1e9'; // Light Blue
        ctx.beginPath();
        ctx.arc(s * 0.1, -s * 0.1, s * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Red Ring (Pro Lens style)
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
        ctx.stroke();
    });

    // --- 3. Camera 2: Cinema Camera (White/Platinum) ---
    const camera2Texture = createTexture(100, (ctx, size) => {
        const s = size * 0.8;

        // Box Body - LIGHTER COLOR
        ctx.fillStyle = '#ECF0F1'; // White/Platinum
        ctx.beginPath();
        ctx.roundRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.8, 4);
        ctx.fill();

        // Details - Side Plate (Grey)
        ctx.fillStyle = '#BDC3C7';
        ctx.beginPath();
        ctx.roundRect(-s * 0.3, -s * 0.3, s * 0.6, s * 0.6, 2);
        ctx.fill();

        // Lens Mount (Dark Contrast)
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(s * 0.1, 0, s * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Lens Glass
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(s * 0.1, 0, s * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(s * 0.15, -s * 0.05, s * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Rec Button (Red)
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.arc(-s * 0.25, -s * 0.25, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Cooling Vents
        ctx.fillStyle = '#95A5A6';
        ctx.fillRect(-s * 0.35, s * 0.25, s * 0.7, s * 0.05);
    });

    // --- 4. Camera 3: Retro/Vintage (Silver & Brown) ---
    const camera3Texture = createTexture(100, (ctx, size) => {
        const s = size * 0.8;
        const width = s;
        const height = s * 0.6;

        // Top Silver Plate
        ctx.fillStyle = '#bdc3c7'; // Silver
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2, width, height, 6);
        ctx.fill();

        // Bottom Leather Wrap
        ctx.fillStyle = '#8d6e63'; // Brown Leather
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2 + height * 0.35, width, height * 0.65, 6);
        ctx.fill();

        // Lens (Offset)
        ctx.fillStyle = '#ecf0f1'; // Silver ring
        ctx.beginPath();
        ctx.arc(width * 0.1, 0, height * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50'; // Dark Glass
        ctx.beginPath();
        ctx.arc(width * 0.1, 0, height * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Viewfinder Window
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.rect(-width * 0.35, -height * 0.4, width * 0.15, height * 0.15);
        ctx.fill();
    });


    // --- Mobile Optimization ---
    function getResponsiveSettings() {
        const isMobile = window.innerWidth < 768;
        return {
            maxBodies: isMobile ? 60 : 200,
            spawnIntervalMs: isMobile ? 600 : 300,
            initialBurst: 10
        };
    }

    let settings = getResponsiveSettings();

    // --- Spawning Logic ---
    function spawnBody() {
        if (!container) return;
        const width = container.clientWidth;

        // Spawn Logic: 20% Drone, 80% Cameras
        const rand = Math.random();
        let texture;
        let scaleVar = 1.0;

        if (rand < 0.2) {
            // 20% Drone
            texture = droneTexture;
            scaleVar = 0.8 + (Math.random() * 0.4);
        } else {
            // 80% Cameras (Split evenly between 3 types)
            const camType = Math.random();
            if (camType < 0.33) texture = camera1Texture;
            else if (camType < 0.66) texture = camera2Texture;
            else texture = camera3Texture;

            scaleVar = 0.7 + (Math.random() * 0.3);
        }

        let x = Math.random() * width;
        const y = -100;

        const padding = 50;
        if (x < padding) x = padding;
        if (x > width - padding) x = width - padding;

        const size = 60 * scaleVar;

        // Circle collider for everything
        const body = Bodies.circle(x, y, size * 0.45, {
            restitution: 0.5,
            friction: 0.7,
            frictionStatic: 1.0,
            density: 0.005,
            angle: Math.random() * Math.PI * 2,
            render: {
                sprite: {
                    texture: texture,
                    xScale: scaleVar * 0.9,
                    yScale: scaleVar * 0.9
                }
            }
        });

        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

        Composite.add(world, body);
    }

    // Initial Burst
    for (let i = 0; i < settings.initialBurst; i++) {
        setTimeout(spawnBody, i * 100);
    }

    // Continuous Spawn
    setInterval(() => {
        const bodies = Composite.allBodies(world);
        const dynamicBodies = bodies.filter(b => !b.isStatic);

        if (dynamicBodies.length < settings.maxBodies) {
            spawnBody();
        }
    }, settings.spawnIntervalMs);

    // --- Interaction ---
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // --- Gyroscope / Device Orientation (Mobile Tilt) ---
    window.addEventListener('deviceorientation', (event) => {
        const orientation = window.orientation || 0;
        const gravity = engine.gravity;

        if (orientation === 0) {
            gravity.x = Math.max(-1, Math.min(1, event.gamma / 50)); // Left/Right tilt
            // gravity.y = Math.max(-1, Math.min(1, event.beta / 50));  // Forward/Back tilt (optional)
        } else if (orientation === 90) {
            gravity.x = Math.max(-1, Math.min(1, event.beta / 50));
        } else if (orientation === -90) {
            gravity.x = Math.max(-1, Math.min(1, -event.beta / 50));
        }
    });

    // --- Scroll Shake Effect ---
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(scrollTop - lastScrollTop) > 5) { // Only if moved enough
            const bodies = Composite.allBodies(world);

            // Jolt power based on scroll speed
            const force = 0.005 * Math.random();

            bodies.forEach(body => {
                if (!body.isStatic) {
                    // Apply small random nudges to simulate turbulence/shaking
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * force,
                        y: (Math.random() - 0.5) * force
                    });
                }
            });
            lastScrollTop = scrollTop;
        }
    });


    // --- Runner & Resize ---
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        if (!container) return;

        // Mobile Address Bar Fix: 
        // Only recreate boundaries if WIDTH changes (orientation change), 
        // not if only height changes (address bar resizing on scroll)
        const currentWidth = window.innerWidth;
        if (Math.abs(currentWidth - lastWidth) < 50) return;

        lastWidth = currentWidth;

        render.canvas.width = container.clientWidth;
        render.canvas.height = container.clientHeight;
        createBoundaries();
        settings = getResponsiveSettings();
    });
});
