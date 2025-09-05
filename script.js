document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Accessible Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        const isVisible = mainNav.getAttribute('data-visible') === 'true';
        mainNav.setAttribute('data-visible', !isVisible);
        navToggle.setAttribute('aria-expanded', !isVisible);
        // Toggle icon for visual feedback
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close the mobile navigation when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- 2. Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- 3. Smooth Scroll-triggered Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    // Using the highly performant Intersection Observer API
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- 4. Three.js Hero Canvas Animation ---
    // This function creates the sophisticated 3D background with a rotating object, 
    // a grayscale particle field, and interactive mouse-move parallax.
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        let scene, camera, renderer, shape, particles;
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // 3D Object (Icosahedron Wireframe)
            const geometry = new THREE.IcosahedronGeometry(1.5, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
            shape = new THREE.Mesh(geometry, material);
            scene.add(shape);

            // Particle System
            const particlesGeometry = new THREE.BufferGeometry();
            const count = 2000;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 10;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0xaaaaaa });
            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            document.addEventListener('mousemove', onDocumentMouseMove);
            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Mouse parallax effect for depth
            camera.position.x += (mouseX - camera.position.x) * .05;
            camera.position.y += (-mouseY - camera.position.y) * .05;
            camera.lookAt(scene.position);

            // Constant rotation for ambient motion
            shape.rotation.y += 0.0005;
            shape.rotation.x += 0.0005;
            particles.rotation.y += 0.0002;

            renderer.render(scene, camera);
        }

        init();
        animate();
    }
});