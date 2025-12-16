// --- 1. BACKGROUND & PARTICLES (MAIN PAGE) ---
(function initNebula() {
    const canvas = document.getElementById('nebula-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles = [], mistParticles = [];
    const colors = { white: 'rgba(255, 255, 255, 0.9)', cyan: 'rgba(64, 224, 208, 0.8)', blue: 'rgba(65, 105, 225, 0.8)' };

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; initParticles(); }
    window.addEventListener('resize', resize);
    const random = (min, max) => Math.random() * (max - min) + min;

    function createMistSprite(color) {
        const s = 256, c = document.createElement('canvas'), x = c.getContext('2d'), g = x.createRadialGradient(128,128,0,128,128,128);
        c.width=c.height=s; g.addColorStop(0, color); g.addColorStop(1, 'transparent');
        x.fillStyle=g; x.beginPath(); x.arc(128,128,128,0,Math.PI*2); x.fill(); return c;
    }
    const mist1 = createMistSprite('rgba(200, 50, 150, 0.15)'), mist2 = createMistSprite('rgba(100, 50, 255, 0.1)');

    class Mist {
        constructor() { this.init(); }
        init() { this.x=random(0,width); this.y=random(0,height); this.v={x:random(-1,1),y:random(-1,1)}; this.s=Math.random()>0.5?mist1:mist2; }
        update() { this.x+=this.v.x; this.y+=this.v.y; if(this.x<-200)this.x=width+200; if(this.x>width+200)this.x=-200; if(this.y<-200)this.y=height+200; if(this.y>height+200)this.y=-200; }
        draw() { ctx.drawImage(this.s, this.x-150, this.y-150, 300, 300); }
    }
    class Sparkle {
        constructor() { this.init(); }
        init() { this.x=random(0,width); this.y=random(0,height); this.size=random(0.5,2.5); this.v={x:random(-2,2),y:random(-2,2)}; this.c=Math.random()>0.9?colors.white:Math.random()>0.6?colors.cyan:colors.blue; this.a=random(0.2,1); this.d=Math.random()>0.5?1:-1; }
        update() { this.x+=this.v.x; this.y+=this.v.y; this.a+=0.05*this.d; if(this.a>=1){this.a=1;this.d=-1}else if(this.a<=0.1){this.a=0.1;this.d=1} if(this.x<0)this.x=width; if(this.x>width)this.x=0; if(this.y<0)this.y=height; if(this.y>height)this.y=0; }
        draw() { ctx.globalAlpha=this.a; ctx.fillStyle=this.c; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
    }
    function initParticles() { particles=[]; mistParticles=[]; for(let i=0;i<6;i++) mistParticles.push(new Mist()); for(let i=0;i<80;i++) particles.push(new Sparkle()); }
    function animate() { ctx.clearRect(0,0,width,height); mistParticles.forEach(p=>{p.update();p.draw()}); ctx.globalCompositeOperation='lighter'; particles.forEach(p=>{p.update();p.draw()}); ctx.globalCompositeOperation='source-over'; requestAnimationFrame(animate); }
    resize(); animate();
})();

// --- 2. GENERAL UI LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; });
    function animateCursor() {
        let dx = mouseX - cursorX; let dy = mouseY - cursorY; cursorX += dx * 0.15; cursorY += dy * 0.15;
        cursorCircle.style.left = cursorX + 'px'; cursorCircle.style.top = cursorY + 'px'; requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover States
    document.querySelectorAll('.interactable').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // 3D Tilt
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if(card.classList.contains('animate-fade-in')) return;
            const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -20; const rotateY = ((x - centerX) / centerX) * 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => { 
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; 
        });
    });

    // Menu
    const menuBtn = document.getElementById('menu-btn'); const menuPopup = document.getElementById('menu-popup');
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); menuPopup.classList.toggle('opacity-0'); menuPopup.classList.toggle('pointer-events-none'); menuPopup.classList.toggle('scale-90'); menuPopup.classList.toggle('scale-100'); });
    document.addEventListener('click', (e) => { if (!menuPopup.contains(e.target) && !menuBtn.contains(e.target)) { menuPopup.classList.add('opacity-0', 'pointer-events-none', 'scale-90'); menuPopup.classList.remove('scale-100'); } });

    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn'); 
    const eventCards = document.querySelectorAll('.event-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            eventCards.forEach(card => {
                card.classList.remove('animate-fade-in'); void card.offsetWidth; card.style.opacity = '1';
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex'; card.classList.add('animate-fade-in');
                    setTimeout(() => { card.classList.remove('animate-fade-in'); card.style.transform = ''; }, 400);
                } else { card.style.display = 'none'; }
            });
        });
    });

    // Modal Functionality
    const modal = document.getElementById('event-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBadge = document.getElementById('modal-badge');
    const modalDescription = document.getElementById('modal-description');
    const modalRules = document.getElementById('modal-rules');
    const modalPrizes = document.getElementById('modal-prizes');
    const modalImage = document.getElementById('modal-image');

    // Event data (you can expand this with actual data)
    const eventData = {
        'Paper Presentation': {
            title: 'Paper Presentation',
            subtitle: 'Innovation Showcase',
            badge: 'FLAGSHIP',
            description: 'Present your innovative ideas for the problem statement. Showcase your research and technical expertise in front of industry experts.',
            rules: ['Maximum 2 members per team', 'Presentation time: 10 minutes', 'Q&A session follows'],
            prizes: ['1st Prize: ₹5000', '2nd Prize: ₹3000', '3rd Prize: ₹2000'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop'
        },
        'Hackathon': {
            title: 'Hackathon',
            subtitle: 'CodeFest Arena',
            badge: 'CODEFEST',
            description: '24-hour grueling test of endurance. Build innovative solutions to real-world problems.',
            rules: ['Team size: 2-4 members', '24 hours duration', 'Themes announced on spot'],
            prizes: ['1st Prize: ₹10000', '2nd Prize: ₹7000', '3rd Prize: ₹5000'],
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop'
        },
        'Robo Soccer': {
            title: 'Robo Soccer',
            subtitle: 'Robotics Challenge',
            badge: 'ROBOTICS',
            description: 'Automated units engage in tactical sport. Build and program robots for soccer competition.',
            rules: ['Robot size restrictions apply', 'Manual control allowed', 'Safety protocols mandatory'],
            prizes: ['1st Prize: ₹8000', '2nd Prize: ₹5000', '3rd Prize: ₹3000'],
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'
        },
        'Pick N Place': {
            title: 'Pick N Place',
            subtitle: 'Precision Robotics',
            badge: 'ROBOTICS',
            description: 'Precision control required. Maneuver robots to pick and place objects accurately.',
            rules: ['Time-based scoring', 'Accuracy is key', 'Multiple rounds'],
            prizes: ['1st Prize: ₹6000', '2nd Prize: ₹4000', '3rd Prize: ₹2500'],
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
        },
        'Line Rush': {
            title: 'Line Rush',
            subtitle: 'RC Racing',
            badge: 'ROBOTICS',
            description: 'Follow the line by your RC to win. High-speed line following competition.',
            rules: ['RC car specifications', 'Track layout provided', 'Fastest time wins'],
            prizes: ['1st Prize: ₹4000', '2nd Prize: ₹2500', '3rd Prize: ₹1500'],
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop'
        },
        'Lab Lockdown': {
            title: 'Lab Lockdown',
            subtitle: 'Circuit Puzzle',
            badge: 'CIRCUITS',
            description: 'Escape the laboratory by solving technical puzzles. Debug circuits and unlock the lab.',
            rules: ['Individual participation', 'Time limit: 30 minutes', 'Logic and knowledge required'],
            prizes: ['1st Prize: ₹3000', '2nd Prize: ₹2000', '3rd Prize: ₹1000'],
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop'
        },
        'Circuit Wars': {
            title: 'Circuit Wars',
            subtitle: 'Hardware Battle',
            badge: 'HARDWARE',
            description: 'Battle of the breadboards. Debug complex circuits and win the war.',
            rules: ['Team of 2', 'Circuit debugging', 'Efficiency matters'],
            prizes: ['1st Prize: ₹5000', '2nd Prize: ₹3000', '3rd Prize: ₹2000'],
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop'
        },
        'Prompt Verse': {
            title: 'Prompt Verse',
            subtitle: 'AI Mastery',
            badge: 'AI/ML',
            description: 'Master the art of AI communication. Craft perfect prompts for AI systems.',
            rules: ['Individual event', 'Prompt engineering', 'Creativity judged'],
            prizes: ['1st Prize: ₹4000', '2nd Prize: ₹2500', '3rd Prize: ₹1500'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
        },
        'Coding Marathon': {
            title: 'Coding Marathon',
            subtitle: 'Algorithm Challenge',
            badge: 'SOFTWARE',
            description: 'Solve algorithmic challenges continuously. Test your coding endurance.',
            rules: ['Individual or team', 'Multiple problems', 'Time and correctness'],
            prizes: ['1st Prize: ₹6000', '2nd Prize: ₹4000', '3rd Prize: ₹2500'],
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop'
        },
        'Treasure Hunt': {
            title: 'Treasure Hunt',
            subtitle: 'Mystery Quest',
            badge: 'MYSTERY',
            description: 'Solve the murder case scenario and find the treasure. Ultimate adventure game.',
            rules: ['Team of 4-6', 'Campus wide', 'Clues and riddles'],
            prizes: ['1st Prize: ₹8000', '2nd Prize: ₹5000', '3rd Prize: ₹3000'],
            image: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=2070&auto=format&fit=crop'
        },
        'Carrom': {
            title: 'Carrom',
            subtitle: 'Table Game',
            badge: 'GAMING',
            description: 'Strike and pocket. Showcase your finger dexterity in this classic game.',
            rules: ['Doubles or singles', 'Standard rules', 'Best of 3'],
            prizes: ['1st Prize: ₹2000', '2nd Prize: ₹1000'],
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop'
        },
        'Chess': {
            title: 'Chess',
            subtitle: 'Mind Game',
            badge: 'STRATEGY',
            description: 'Checkmate your opponent in this battle of wits. Strategic thinking required.',
            rules: ['Standard chess rules', 'Time control', 'Tournament format'],
            prizes: ['1st Prize: ₹3000', '2nd Prize: ₹2000', '3rd Prize: ₹1000'],
            image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2070&auto=format&fit=crop'
        },
        'General Quiz': {
            title: 'General Quiz',
            subtitle: 'Knowledge Battle',
            badge: 'TRIVIA',
            description: 'Rapid-fire quiz covering social science and current affairs.',
            rules: ['Team of 2-3', 'Multiple rounds', 'Quick responses'],
            prizes: ['1st Prize: ₹4000', '2nd Prize: ₹2500', '3rd Prize: ₹1500'],
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop'
        },
        'IPL Auction': {
            title: 'IPL Auction',
            subtitle: 'Cricket Strategy',
            badge: 'MANAGEMENT',
            description: 'Build your dream team. Strategize your budget in this cricket auction simulation.',
            rules: ['Team management', 'Budget constraints', 'Strategy wins'],
            prizes: ['1st Prize: ₹5000', '2nd Prize: ₹3000', '3rd Prize: ₹2000'],
            image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070&auto=format&fit=crop'
        },
        'Free Fire': {
            title: 'Free Fire',
            subtitle: 'Battle Royale',
            badge: 'ESPORTS',
            description: 'Battle Royale. Survival of the fittest in this mobile gaming tournament.',
            rules: ['Squad matches', 'Ranked play', 'Fair play mandatory'],
            prizes: ['1st Prize: ₹10000', '2nd Prize: ₹7000', '3rd Prize: ₹5000'],
            image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=2070&auto=format&fit=crop'
        },
        'E-Football': {
            title: 'E-Football',
            subtitle: 'Virtual Football',
            badge: 'ESPORTS',
            description: 'Virtual pitch glory. 1v1 football simulation tournament.',
            rules: ['FIFA game', 'Single matches', 'Skill demonstration'],
            prizes: ['1st Prize: ₹6000', '2nd Prize: ₹4000', '3rd Prize: ₹2500'],
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop'
        },
        'IoT Grid': {
            title: 'IoT Grid',
            subtitle: 'Connected World',
            badge: 'TRAINING',
            description: 'Interface with the ESP32 node. Establish global connectivity in IoT workshop.',
            rules: ['Hands-on workshop', 'Basic electronics', 'Programming involved'],
            prizes: ['Certificates', 'Best project award'],
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop'
        }
    };

    eventCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const eventName = card.querySelector('h3').textContent.trim();
            const category = card.getAttribute('data-category');
            const data = eventData[eventName];
            
            if (data) {
                // Set theme
                modal.classList.remove('theme-tech', 'theme-non-tech', 'theme-flagship');
                if (category === 'tech') {
                    modal.classList.add('theme-tech');
                    document.querySelectorAll('.modal-bg-mesh').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-bg-stars, .modal-bg-flagship').forEach(el => el.classList.add('hidden'));
                    document.querySelectorAll('.modal-blob-tech').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-blob-nebula, .modal-blob-flagship').forEach(el => el.classList.add('hidden'));
                } else if (category === 'non-tech') {
                    modal.classList.add('theme-non-tech');
                    document.querySelectorAll('.modal-bg-stars').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-bg-mesh, .modal-bg-flagship').forEach(el => el.classList.add('hidden'));
                    document.querySelectorAll('.modal-blob-nebula').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-blob-tech, .modal-blob-flagship').forEach(el => el.classList.add('hidden'));
                } else if (category === 'flagship') {
                    modal.classList.add('theme-flagship');
                    document.querySelectorAll('.modal-bg-flagship').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-bg-mesh, .modal-bg-stars').forEach(el => el.classList.add('hidden'));
                    document.querySelectorAll('.modal-blob-flagship').forEach(el => el.classList.remove('hidden'));
                    document.querySelectorAll('.modal-blob-tech, .modal-blob-nebula').forEach(el => el.classList.add('hidden'));
                } else {
                    // Default
                    document.querySelectorAll('.modal-bg-mesh, .modal-bg-stars, .modal-bg-flagship, .modal-blob-tech, .modal-blob-nebula, .modal-blob-flagship').forEach(el => el.classList.add('hidden'));
                }

                // Populate content
                modalTitle.textContent = data.title;
                modalSubtitle.textContent = data.subtitle;
                modalBadge.textContent = data.badge;
                modalDescription.textContent = data.description;
                modalImage.style.backgroundImage = `url('${data.image}')`;
                
                modalRules.innerHTML = data.rules.map(rule => `<li>${rule}</li>`).join('');
                modalPrizes.innerHTML = data.prizes.map(prize => `<li>${prize}</li>`).join('');

                // Show modal
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Scroll Header
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY; const headerContent = document.getElementById('header-content'); const startEffectAt = 100;
        if (scrolled > startEffectAt) {
            const effectiveScroll = scrolled - startEffectAt; const opacity = 1 - (effectiveScroll / 800); const scale = 1 - (effectiveScroll / 2500);
            headerContent.style.opacity = opacity > 0 ? opacity : 0; headerContent.style.transform = `translateY(${effectiveScroll * 0.4}px) scale(${scale})`;
        } else { headerContent.style.opacity = 1; headerContent.style.transform = 'translateY(0) scale(1)'; }
    });

    // Reveal Animation
    const observer = new IntersectionObserver((entries) => { 
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } }); 
    }, { threshold: 0.1 }); 
    document.querySelectorAll('.reveal-container').forEach(section => observer.observe(section));
});