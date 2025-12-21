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

    // Locate the Filters section in your DOMContentLoaded block
const filterBtns = document.querySelectorAll('.filter-btn'); 
const eventCards = document.querySelectorAll('.event-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active')); 
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        eventCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            // Logic: Show if 'all' is selected OR if the category matches the filter
            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else { 
                card.style.display = 'none'; 
            }
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

    // Updated Event Data with Prize Pool and Team Size
    const eventData = {
        'Paper Presentation': {
            title: 'Paper Presentation',
            subtitle: 'Innovation Showcase',
            badge: 'FLAGSHIP',
            prizePool: '₹10,000+',
            teamSize: '1-2 Members',
            description: 'Present your innovative ideas for the problem statement. Showcase your research and technical expertise in front of industry experts.',
            rules: ['Maximum 2 members per team', 'Presentation time: 10 minutes', 'Q&A session follows'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop'
        },
        'Hackathon': {
            title: 'Hackathon',
            subtitle: 'CodeFest Arena',
            badge: 'CODEFEST',
            prizePool: '₹22,000+',
            teamSize: '2-4 Members',
            description: '24-hour grueling test of endurance. Build innovative solutions to real-world problems.',
            rules: ['Team size: 2-4 members', '24 hours duration', 'Themes announced on spot'],
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop'
        },
        'Robo Soccer': {
            title: 'Robo Soccer',
            subtitle: 'Robotics Challenge',
            badge: 'ROBOTICS',
            prizePool: '₹16,000+',
            teamSize: 'Up to 4 Members',
            description: 'Automated units engage in tactical sport. Build and program robots for soccer competition.',
            rules: ['Robot size restrictions apply', 'Manual control allowed', 'Safety protocols mandatory'],
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'
        },
        'Pick N Place': {
            title: 'Pick N Place',
            subtitle: 'Precision Robotics',
            badge: 'ROBOTICS',
            prizePool: '₹12,500+',
            teamSize: '1-3 Members',
            description: 'Precision control required. Maneuver robots to pick and place objects accurately.',
            rules: ['Time-based scoring', 'Accuracy is key', 'Multiple rounds'],
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
        },
        'Line Rush': {
            title: 'Line Rush',
            subtitle: 'RC Racing',
            badge: 'ROBOTICS',
            prizePool: '₹8,000+',
            teamSize: '1-2 Members',
            description: 'Follow the line by your RC to win. High-speed line following competition.',
            rules: ['RC car specifications apply', 'Track layout provided', 'Fastest time wins'],
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop'
        },
        'Lab Lockdown': {
            title: 'Lab Lockdown',
            subtitle: 'Circuit Puzzle',
            badge: 'CIRCUITS',
            prizePool: '₹6,000+',
            teamSize: 'Individual',
            description: 'Escape the laboratory by solving technical puzzles. Debug circuits and unlock the lab.',
            rules: ['Individual participation', 'Time limit: 30 minutes', 'Logic and knowledge required'],
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop'
        },
        'Circuit Wars': {
            title: 'Circuit Wars',
            subtitle: 'Hardware Battle',
            badge: 'HARDWARE',
            prizePool: '₹10,000+',
            teamSize: '2 Members',
            description: 'Battle of the breadboards. Debug complex circuits and win the war.',
            rules: ['Team of 2', 'Circuit debugging', 'Efficiency matters'],
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop'
        },
        'Prompt Verse': {
            title: 'Prompt Verse',
            subtitle: 'AI Mastery',
            badge: 'AI/ML',
            prizePool: '₹8,000+',
            teamSize: 'Individual',
            description: 'Master the art of AI communication. Craft perfect prompts for AI systems.',
            rules: ['Individual event', 'Prompt engineering', 'Creativity judged'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
        },
        'Coding Marathon': {
            title: 'Coding Marathon',
            subtitle: 'Algorithm Challenge',
            badge: 'SOFTWARE',
            prizePool: '₹12,500+',
            teamSize: '1-2 Members',
            description: 'Solve algorithmic challenges continuously. Test your coding endurance.',
            rules: ['Individual or team', 'Multiple problems', 'Time and correctness'],
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop'
        },
        'Treasure Hunt': {
            title: 'Treasure Hunt',
            subtitle: 'Mystery Quest',
            badge: 'MYSTERY',
            prizePool: '₹16,000+',
            teamSize: '4-6 Members',
            description: 'Solve the murder case scenario and find the treasure. Ultimate adventure game.',
            rules: ['Team of 4-6', 'Campus wide', 'Clues and riddles'],
            image: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=2070&auto=format&fit=crop'
        },
        // Add these to eventData in script.js
'Coding Combo': {
    title: 'CODING COMBO',
    subtitle: 'THE FULL-STACK PATHWAY',
    badge: 'ELITE BUNDLE',
    description: 'Elevate your status to Elite Developer. This specialized protocol grants you simultaneous access to the 24H Hackathon and the Coding Marathon. Master both endurance and speed in a single uplink.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'
},
'Circuit Combo': {
    title: 'CIRCUIT COMBO',
    subtitle: 'THE SILICON VORTEX',
    badge: 'ELITE BUNDLE',
    description: 'A dedicated uplink for Hardware Architects. Unlock both Circuit Wars and Lab Lockdown with one command. Debug the physical world and solve the laboratory mysteries in this high-voltage package.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070'
},
        'Carrom': {
            title: 'Carrom',
            subtitle: 'Table Game',
            badge: 'GAMING',
            prizePool: '₹3,000+',
            teamSize: '1-2 Members',
            description: 'Strike and pocket. Showcase your finger dexterity in this classic game.',
            rules: ['Doubles or singles', 'Standard rules', 'Best of 3'],
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop'
        },
        'Chess': {
            title: 'Chess',
            subtitle: 'Mind Game',
            badge: 'STRATEGY',
            prizePool: '₹6,000+',
            teamSize: 'Individual',
            description: 'Checkmate your opponent in this battle of wits. Strategic thinking required.',
            rules: ['Standard chess rules', 'Time control', 'Tournament format'],
            image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2070&auto=format&fit=crop'
        },
        'General Quiz': {
            title: 'General Quiz',
            subtitle: 'Knowledge Battle',
            badge: 'TRIVIA',
            prizePool: '₹8,000+',
            teamSize: '2-3 Members',
            description: 'Rapid-fire quiz covering social science and current affairs.',
            rules: ['Team of 2-3', 'Multiple rounds', 'Quick responses'],
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop'
        },
        'IPL Auction': {
            title: 'IPL Auction',
            subtitle: 'Cricket Strategy',
            badge: 'MANAGEMENT',
            prizePool: '₹10,000+',
            teamSize: '3-4 Members',
            description: 'Build your dream team. Strategize your budget in this cricket auction simulation.',
            rules: ['Team management', 'Budget constraints', 'Strategy wins'],
            image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070&auto=format&fit=crop'
        },
        'Free Fire': {
            title: 'Free Fire',
            subtitle: 'Battle Royale',
            badge: 'ESPORTS',
            prizePool: '₹22,000+',
            teamSize: 'Squad (4)',
            description: 'Battle Royale. Survival of the fittest in this mobile gaming tournament.',
            rules: ['Squad matches', 'Ranked play', 'Fair play mandatory'],
            image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=2070&auto=format&fit=crop'
        },
        'E-Football': {
            title: 'E-Football',
            subtitle: 'Virtual Football',
            badge: 'ESPORTS',
            prizePool: '₹12,500+',
            teamSize: 'Individual',
            description: 'Virtual pitch glory. 1v1 football simulation tournament.',
            rules: ['FIFA game', 'Single matches', 'Skill demonstration'],
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop'
        },
        'IoT Grid': {
            title: 'IoT Grid',
            subtitle: 'Connected World',
            badge: 'TRAINING',
            prizePool: 'Certification',
            teamSize: 'Individual',
            description: 'Interface with the ESP32 node. Establish global connectivity in IoT workshop.',
            rules: ['Hands-on workshop', 'Basic electronics', 'Programming involved'],
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop'
        }
    };

    // Rules Toggle Logic
    const rulesBtn = document.getElementById('rules-toggle-btn');
    const rulesContent = document.getElementById('rules-content');
    const rulesIcon = document.getElementById('rules-icon');

    rulesBtn.addEventListener('click', () => {
        const isOpen = rulesContent.style.maxHeight !== '0px' && rulesContent.style.maxHeight !== '';
        
        if (isOpen) {
            rulesContent.style.maxHeight = '0px';
            rulesIcon.style.transform = 'rotate(0deg)';
        } else {
            rulesContent.style.maxHeight = rulesContent.scrollHeight + 'px';
            rulesIcon.style.transform = 'rotate(180deg)';
        }
    });

    // Important: Reset rules accordion when closing modal
    const closeBtn = document.getElementById('close-modal');
    closeBtn.addEventListener('click', () => {
        rulesContent.style.maxHeight = '0px';
        rulesIcon.style.transform = 'rotate(0deg)';
    });

   eventCards.forEach(card => {
    card.addEventListener('click', () => {
        const eventName = card.querySelector('h3').textContent.trim();
        const category = card.getAttribute('data-category');
        const data = eventData[eventName];
        
        if (data) {
            const isCombo = (category === 'combo');

            // --- 1. RESET ALL THEMES AND BACKGROUNDS ---
            modal.classList.remove('theme-tech', 'theme-non-tech', 'theme-flagship', 'theme-combo');
            document.querySelectorAll('.modal-bg-mesh, .modal-bg-stars, .modal-bg-flagship, .modal-blob-tech, .modal-blob-nebula, .modal-blob-flagship')
                .forEach(el => el.classList.add('hidden'));

            // --- 2. RESTORE VISIBILITY FOR STANDARD ELEMENTS ---
            // If it's NOT a combo, show the rules and metadata sections
            const standardElements = document.querySelectorAll('#rules-toggle-btn, #rules-content, .flex-wrap.gap-4, .grid-cols-1.md\\:grid-cols-3');
            standardElements.forEach(el => el.style.display = isCombo ? 'none' : 'flex');

            // --- 3. APPLY CATEGORY SPECIFIC THEMES & BACKGROUNDS ---
            const regBtn = modal.querySelector('.cosmic-btn');
            
            if (category === 'tech') {
                modal.classList.add('theme-tech');
                document.querySelectorAll('.modal-bg-mesh-tech, .modal-blob-tech').forEach(el => el.classList.remove('hidden'));
                regBtn.innerHTML = 'SECURE YOUR SPOT <i class="fas fa-bolt ml-2"></i>';
            } 
            else if (category === 'non-tech') {
                modal.classList.add('theme-non-tech');
                document.querySelectorAll('.modal-stars-bg, .modal-blob-nebula').forEach(el => el.classList.remove('hidden'));
                regBtn.innerHTML = 'SECURE YOUR SPOT <i class="fas fa-bolt ml-2"></i>';
            } 
            else if (category === 'flagship') {
                modal.classList.add('theme-flagship');
                document.querySelectorAll('.modal-bg-flagship, .modal-blob-flagship').forEach(el => el.classList.remove('hidden'));
                regBtn.innerHTML = 'SECURE YOUR SPOT <i class="fas fa-bolt ml-2"></i>';
            }
            else if (category === 'combo') {
                modal.classList.add('theme-combo');
                // Combos use the Nebula/Star background for a premium feel
                document.querySelectorAll('.modal-stars-bg, .modal-blob-nebula').forEach(el => el.classList.remove('hidden'));
                regBtn.innerHTML = 'INITIALIZE BUNDLE PROTOCOL <i class="fas fa-layer-group ml-2"></i>';
            }

            // --- 4. POPULATE CONTENT ---
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalBadge.textContent = data.badge;
            modalDescription.textContent = data.description;
            modalImage.style.backgroundImage = `url('${data.image}')`;
            
            // Populate metadata only if not a combo
            if (!isCombo) {
                document.getElementById('modal-prize-pool').textContent = data.prizePool || 'TBA';
                document.getElementById('modal-team-size').textContent = data.teamSize || 'TBA';
                if (data.rules) {
                    modalRules.innerHTML = data.rules.map(rule => `<li>${rule}</li>`).join('');
                }
            }

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            const wrapper = document.getElementById('modal-content-wrapper');
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        wrapper.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
    }, 50);
        }
    });
});
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    closeModalBtn.addEventListener('mouseenter', () => {
    document.body.classList.add('hovering');
    // Optional: add a specific class to the cursor for the close button
    document.querySelector('.cursor-circle').style.borderColor = '#ef4444';
});

closeModalBtn.addEventListener('mouseleave', () => {
    document.body.classList.remove('hovering');
    document.querySelector('.cursor-circle').style.borderColor = 'rgba(96, 165, 250, 0.5)';
});

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Inside your DOMContentLoaded block
    document.getElementById('close-modal').addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    document.getElementById('close-modal').addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });


    // --- Combo Verification Logic ---
const verifyModal = document.getElementById('combo-verify-modal');
const closeVerifyBtn = document.getElementById('close-verify-btn');
const goToComboBtn = document.getElementById('go-to-combo-btn');
const eventModalRegBtn = document.querySelector('#event-modal .cosmic-btn');

// List of event titles that trigger the check
const comboTriggerEvents = ['Circuit Wars', 'Lab Lockdown', 'Coding Marathon', 'Prompt Verse'];

eventModalRegBtn.addEventListener('click', (e) => {
    const currentEventTitle = document.getElementById('modal-title').textContent.trim();
    
    // Check if the current event is one of the targeted titles
    if (comboTriggerEvents.includes(currentEventTitle)) {
        e.preventDefault(); // Stop the immediate registration
        verifyModal.classList.remove('hidden'); // Show the warning window
    }
});

// 1. "Analyze Bundle Protocols" (Go to Combo Section)
goToComboBtn.addEventListener('click', () => {
    verifyModal.classList.add('hidden'); // Close warning
    document.getElementById('event-modal').classList.add('hidden'); // Close event modal
    document.body.style.overflow = 'auto'; // Restore scroll
    
    // Find the combo filter button and click it
    const comboFilter = document.querySelector('.filter-btn[data-filter="combo"]');
    if (comboFilter) {
        comboFilter.click();
        // Smooth scroll to events
        document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    }
});

// 2. "Abort Command" (Close window)
closeVerifyBtn.addEventListener('click', () => {
    verifyModal.classList.add('hidden');
});

// Optional: Close on backdrop click
verifyModal.addEventListener('click', (e) => {
    if (e.target === verifyModal) verifyModal.classList.add('hidden');
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
    // --- Enhanced Reveal Observer ---
const observerOptions = {
    threshold: 0.15, // Trigger when 15% of the section is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the viewport
};

const observer = new IntersectionObserver((entries) => { 
    entries.forEach(entry => { 
        if (entry.isIntersecting) { 
            entry.target.classList.add('visible'); 
            // Optional: stop observing once shown to keep performance high
            // observer.unobserve(entry.target); 
        } 
    }); 
}, observerOptions); 

document.querySelectorAll('.reveal-container').forEach(section => observer.observe(section));

// Add this specific fix to your existing observer in script.js
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.05, rootMargin: "0px 0px 100px 0px" }); // Triggers earlier

document.querySelectorAll('footer.reveal-container').forEach(f => footerObserver.observe(f));

// --- UNIFIED TIMELINE FILTER LOGIC ---
const initTimeline = () => {
    const timelineFilters = document.querySelectorAll('.timeline-filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineFilters.length) return;

    // 1. Initial State: Function to apply filter
    const applyFilter = (session) => {
    timelineItems.forEach(item => {
        const itemSession = item.getAttribute('data-session');
        if (itemSession === session) {
            // Remove hidden class first
            item.classList.remove('hidden-node');
            item.style.display = "block"; 
            
            // Trigger animation
            requestAnimationFrame(() => {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            });
        } else {
            // Hide completely
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            item.classList.add('hidden-node');
            item.style.display = "none";
        }
    });
};

    // 2. Set default view (Day 1 Forenoon)
    applyFilter("d1-fn");

    // 3. Click Logic
    timelineFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update button styles
            timelineFilters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const selectedSession = btn.getAttribute('data-session');
            applyFilter(selectedSession);
        });
    });
};

// Call the function inside your existing DOMContentLoaded
initTimeline();
});

