// ========================================
// 自定义光标
// ========================================
(() => {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    // 光环延迟跟随
    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        const w = ring.offsetWidth / 2;
        ring.style.transform = `translate(${ringX - w}px, ${ringY - w}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // 悬停元素放大
    const hoverTargets = 'a, button, .tag, .skill-card, .project-card, .stat-card, .form-input';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover-active'));
    });

    // 点击波纹
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed; top: ${e.clientY}px; left: ${e.clientX}px;
            width: 0; height: 0; border-radius: 50%;
            border: 2px solid rgba(168,85,247,0.5);
            transform: translate(-50%,-50%); pointer-events: none;
            z-index: 9998; transition: all 0.5s ease;
        `;
        document.body.appendChild(ripple);
        requestAnimationFrame(() => {
            ripple.style.width = '80px';
            ripple.style.height = '80px';
            ripple.style.opacity = '0';
        });
        setTimeout(() => ripple.remove(), 500);
    });
})();


// ========================================
// 粒子背景
// ========================================
(() => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let mouse = { x: null, y: null };
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 50 : 120;
    const MAX_DISTANCE = 130;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // 边界反弹
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // 鼠标排斥
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DISTANCE) {
                    const opacity = (1 - dist / MAX_DISTANCE) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(120, 100, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();
})();


// ========================================
// 打字机效果
// ========================================
(() => {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        '全栈开发工程师',
        'UI/UX 爱好者',
        '开源贡献者',
        '问题解决专家',
        '代码艺术家'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    const TYPE_SPEED = 100;
    const DELETE_SPEED = 50;
    const PAUSE = 1800;

    function type() {
        const current = phrases[phraseIdx];

        if (!deleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, PAUSE);
                return;
            }
            setTimeout(type, TYPE_SPEED);
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
            setTimeout(type, DELETE_SPEED);
        }
    }
    type();
})();


// ========================================
// 滚动揭示动画
// ========================================
(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
})();


// ========================================
// 数字计数动画
// ========================================
(() => {
    const statCards = document.querySelectorAll('.stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const numEl = card.querySelector('.stat-number');
                const target = parseInt(card.querySelector('.stat-number').dataset.count);
                const duration = 2000;
                const startTime = performance.now();

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    numEl.textContent = Math.floor(eased * target) + (target >= 1000 ? '+' : '');
                    if (progress < 1) requestAnimationFrame(update);
                    else numEl.textContent = target + (target >= 1000 ? '+' : '');
                }
                requestAnimationFrame(update);
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
})();


// ========================================
// 技能进度条动画
// ========================================
(() => {
    const bars = document.querySelectorAll('.skill-progress-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.dataset.progress;
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
})();


// ========================================
// 主题切换
// ========================================
(() => {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('.toggle-icon');
    const html = document.documentElement;

    if (!toggle || !icon) return;

    // 读取本地存储
    const saved = localStorage.getItem('theme');
    if (saved) {
        html.setAttribute('data-theme', saved);
        icon.textContent = saved === 'dark' ? '🌙' : '☀️';
    }

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        icon.textContent = next === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', next);
    });
})();


// ========================================
// 导航栏
// ========================================
(() => {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // 滚动效果
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // 高亮当前 section
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });

    // 移动端菜单
    burger?.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // 点击链接关闭菜单
    links.forEach(link => {
        link.addEventListener('click', () => {
            burger?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
})();


// ========================================
// 联系表单
// ========================================
(() => {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('span');
        const originalText = btnText.textContent;

        btnText.textContent = '发送中...';
        btn.disabled = true;

        // 模拟发送
        setTimeout(() => {
            status.textContent = '✓ 消息已发送！我会尽快回复你。';
            status.classList.add('show');
            btnText.textContent = originalText;
            btn.disabled = false;
            form.reset();

            setTimeout(() => {
                status.classList.remove('show');
                status.textContent = '';
            }, 4000);
        }, 1500);
    });
})();


// ========================================
// 年份
// ========================================
document.getElementById('year').textContent = new Date().getFullYear();


// ========================================
// 倾斜效果（3D 卡片）
// ========================================
(() => {
    const cards = document.querySelectorAll('.skill-card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
