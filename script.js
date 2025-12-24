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
            prizePool: '₹10,000',
            teamSize: '1-2 Members',
            entryFee: '₹500 / team',
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
       'Cyber Kick': {
            title: 'Cyber Kick',
            subtitle: 'ROBOVERSE SERIES',
            badge: 'ROBOTICS',
            prizePool: '₹10,000',
            entryFee: '₹150 / Team', 
            regLink: 'https://forms.gle/WWNiNaqffcK8xzoS6',
            rulebook: 'cyber_kick.docx',
            teamSize: 'Up to 4 Members',
            description: 'Cyber Kick is an elite competitive arena where engineering meets athletic strategy. This event challenges teams to design and build manually controlled robots capable of high-speed maneuvers, precise ball handling, and tactical real-time gameplay. It serves as a rigorous test of system integration, wireless communication reliability, and operational stability under match conditions.',
            rules: [
                'Matches consist of two 180-second halves with a 30-second maintenance interval.',
                'Robots must operate within a 30cm x 30cm x 30cm footprint and not exceed 4kg.',
                'Mechanisms for grabbing, scooping, or lifting the ball are strictly prohibited; only pushing or hitting is allowed.',
                'Excessive ramming or intentional attempts to damage an opponent’s bot will result in immediate disqualification.',
                'A maximum of 3 restarts are permitted per match, with the timer remaining active throughout.',
                'Note: Refer to "cyber_kick.docx" for full technical arena specifications.'
            ],
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Pooja N', phone: '+91 8220510532' },
                { name: 'Gautham Raj H', phone: '+91 8668021608' }
            ]
        },
        'Maze Drift': {
            title: 'Maze Drift',
            subtitle: 'ROBOVERSE SERIES',
            badge: 'ROBOTICS',
            prizePool: '₹10,000',
            entryFee: '₹150 / Team',
            teamSize: 'Up to 5 Members',
            regLink: 'https://forms.gle/VsK9cbYpfSDF9qZf9',
            rulebook: 'MAZEDRIFT.pdf',
            description: 'Maze Drift is a sophisticated autonomous robotics competition requiring participants to develop bots capable of high-precision line following and maze mapping. The challenge is divided into a "Dry Run" for environmental analysis and memory storage, followed by an "Actual Run" where the bot must calculate and execute the shortest possible path to the terminal zone in minimum time.',
            rules: [
                'The bot must reach the end zone black box within a 3-minute dry run window to qualify.',
                'Autonomous units must fit within a 220mm x 220mm x 220mm dimension box.',
                'Bots must be equipped with a red LED that illuminates upon sensing the terminal black box.',
                'Maximum of 3 restarts are allowed; however, the timer will not be paused or reset.',
                'Points are awarded for checkpoint crossing, successful dry runs, and shortest path optimization.',
                'Note: Refer to "MAZEDRIFT.pdf" for arena dimensions and logic rules.'
            ],
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'GOBIKA NS', phone: '+91 9345531715' },
                { name: 'BHUVAN RAJ M', phone: '+91 9677564359' }
            ]
        },
        'Lift-N-Shift': {
            title: 'Lift-N-Shift',
            subtitle: 'ROBOVERSE SERIES',
            badge: 'ROBOTICS',
            prizePool: '₹10,000',
            entryFee: '₹150 / Team',
            teamSize: '1-4 Members',
            regLink: 'https://forms.gle/rCNZyKSWk5rh7nZx9',
            rulebook: 'pick n place.docx',
            description: 'Lift-N-Shift is a flagship robotics challenge designed to evaluate mechanical ingenuity and manual precision. Participants must engineer a manually operated bot capable of sophisticated object handling, navigating a dynamic obstacle-filled arena, and accurately depositing blocks into designated high-value zones under strict time constraints.',
            rules: [
                'Successful crossing of the finish line after all deposits is mandatory for score validation.',
                'Bots must not exceed dimensions of 300mm x 250mm x 300mm, including the gripper mechanism.',
                'Blocks must be lifted and placed; dragging or sliding across the floor is strictly forbidden.',
                'Onboard power supply must not exceed a potential difference of 15V DC.',
                'Human intervention is strictly limited to repositioning the bot at designated checkpoints.',
                'Note: Refer to "pick n place.docx" for detailed scoring and penalty criteria.'
            ],
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Shageetha Johnson A', phone: '+91 9360002955' },
                { name: 'Raghubathi Raja T K', phone: '+91 9363170477' }
            ]
        },
        'Lab Lockdown': {
            title: 'Lab Lockdown: The Engineering Gauntlet',
            subtitle: 'CIRCUIT ESCAPE CHALLENGE',
            badge: 'CIRCUITS',
            prizePool: '₹2,000',
            entryFee: '₹200 / Team', // Added entry fee as requested
            regLink: '#',
            teamSize: '3 Members',
            description: 'Lab Lockdown is an elite technical simulation designed to evaluate engineering fundamentals, logical synthesis, and collaborative problem-solving across all disciplines. Participants are immersed in a high-pressure environment where they must decrypt technical locks and navigate a series of sequential challenges to successfully "unlock" the facility.',
            rules: [
                'Team Composition: Each squad must consist of exactly 3 members.',
                'Round 1 (Observe & Decode): A high-stakes evaluation of cognitive recall and attention to detail under time pressure.',
                'Round 2 (Resource Procurement): Teams must identify and secure specific electronic components required for the final phase.',
                'Round 3 (System Synthesis): The terminal round requiring precision circuit building based on the previous round’s intelligence.',
                'Zero-Device Policy: Mobile phones, smartwatches, and all electronic gadgets are strictly prohibited.',
                'Punctuality: Teams must report to the station 15 minutes prior to the scheduled commencement.',
                'Final Authority: All adjudicator and coordinator decisions are absolute and binding.'
            ],
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop',
            coordinators: [
                { name: 'DILSAATH BEGUM S', phone: '+91 9679520411 ' },
                { name: 'SUSHMITHA M', phone: '+91 8122242850' },
                { name: 'ILAYASREE M', phone: '+91 8072303204' }
            ]
        },
        'Circuit Wars': {
            title: 'Circuit Chronicles: The Technical Gauntlet',
            subtitle: 'Hardware Battle',
            badge: 'HARDWARE',
            prizePool: '₹2,000+',
            regLink: '',
            teamSize: '2-3 Members',
            entryFee: '₹200 / team',
            description: 'A high-intensity, three-stage engineering challenge designed to test visual memory, diagnostic precision, and collaborative problem-solving. Teams must navigate through rapid-fire recalls and complex physical puzzles to prove their mastery over circuit theory and real-world electronics.',
            rules: [
                'Team Dynamics: Each team must consist of exactly 2–3 participants; report 10 minutes prior to start time.',
                'Device Policy: Strict prohibition of mobile phones, smartwatches, and internet-enabled devices.',
                'Blink & Think: A 25-minute rapid-fire round requiring teams to recall details of circuits or waveforms.',
                'Fault Hunt: A 25-minute diagnostic round where teams must identify the maximum number of errors in a complex circuit.',
                'Circuit Escape Room: A 40-minute immersive finale where solving electronics puzzles is the only way to win.',
                'Integrity: All decisions by adjudicators are final; cross-team collaboration is strictly forbidden.'
            ],
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Brindhaa M', phone: '+91 7845107141' },
                { name: 'Dhanam S', phone: '+91 7094558947' },
                { name: 'Yashiga D', phone: '+91 9994926161' }
            ]
        },
        'Prompt Verse': {
            title: 'Prompt Verse',
            subtitle: 'AI Mastery',
            badge: 'AI/ML',
            prizePool: '₹2,000',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfH_3tDdJz15R4BX4pjW7FkaXCVjUhzRQLLwEPTFHCWy5f2uQ/viewform?usp=header',
            teamSize: '2 Members', // Updated from Individual to match your new rules
            entryFee: '₹200 / team',
            description: 'A fast-paced competition challenging teams to master AI prompt engineering through memory, speed, and creative precision. Teams must bridge the gap between human observation and digital generation across three increasingly difficult rounds.',
            rules: [
                'Teams & Tools: Exactly two members using text-only prompts; no image uploads or external edits allowed.',
                'Submission: All files must be uploaded to the assigned Drive folder within 30 seconds; late entries are disqualified.',
                'Round 1 (Precision): 10-image challenge testing direct observation and rapid memory recall.',
                'Round 2 (Coordination): Split-vision challenge where partners describe separate image halves to generate a unified result.',
                'Round 3 (Creative): On-the-spot thematic video generation and conceptual presentation.',
            ],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Prem kumar S', phone: '+91 90259 86911' },
                { name: 'Divya G', phone: '+91 93423 73675' },
                { name: 'Sasi M', phone: '+91 73971 77330' }
            ]
        },
        'Coding Marathon': {
            title: 'Coding Marathon',
            subtitle: 'Algorithm Challenge',
            badge: 'SOFTWARE',
            prizePool: '₹2,000',
            regLink: 'https://link-here.com',
            teamSize: '1-2 Members',
            description: 'Solve algorithmic challenges continuously. Test your coding endurance.',
            rules: ['Individual or team', 'Multiple problems', 'Time and correctness'],
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop'
        },
        'Treasure Hunt': {
            title: 'Treasure Hunt',
            subtitle: 'Investigation Challenge',
            badge: 'MYSTERY',
            prizePool: '₹1,500',
            teamSize: 'Teams',
            regLink: '',
            description: 'An immersive investigation-based challenge where participants analyze evidence, decode clues, and question assumptions to uncover hidden truths. The event tests critical thinking, observation, and decision-making under time pressure. Not all clues are reliable, making logical reasoning and judgment essential for success.',
            rules: [
                'Teams must stay together throughout the investigation.',
                'Analyze clues logically, blind following of instructions may lead to dead ends.',
                'Note: Some clues are intentionally misleading and may not lead to the solution.',
                'Participants must manage time efficiently while choosing investigation paths.',
                'Tampering with clues or sharing answers between teams is prohibited.',
                'Correctly uncovering the truth with proper justification is required to win.',
                'The event will run for 2 hours (2:00 PM – 4:00 PM).',
                'The decision of the event coordinators is final and binding.'
            ],
            image: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'SHARVESHWAR S', phone: '+91 7904240505' },
                { name: 'SWATHILAKSHMI J', phone: '+91 6374625670' },
                { name: 'VIDHUSHA B', phone: '+91 8610536117' }
            ]
        },
        // Add these to eventData in script.js
'Coding Combo': {
    title: 'The Duo Pass',
    subtitle: '',
    badge: '',
    regLink: 'https://link-here.com',
    description: 'The Duo Pass is a premium cross-disciplinary uplink designed for participants who balance creative prompt engineering with tactical board-game mastery. This specialized protocol bridges the gap between digital innovation and classic competitive strategy. By initializing this pass, you gain simultaneous access to Prompt Verse (AI Mastery) and the Coding Challenge (Algorithmic Logic), plus Carrom for precision.',    
    coordinators: [
        { name: 'Sabreeshwaran', phone: '+91 8870247551' },
        { name: '', phone: '+91 ' }
    ]
},
'Circuit Combo': {
    title: 'Circuit Combo',
    subtitle: 'THE SILICON VORTEX',
    badge: 'ELITE BUNDLE',
    regLink:'#',
    description: 'A dedicated uplink for Hardware Architects. Unlock both Circuit Wars and Lab Lockdown with one command. Debug the physical world and solve the laboratory mysteries in this high-voltage package.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070'
},

        'Carrom': {
            title: 'Carrom',
            subtitle: 'Table Game',
            badge: 'GAMING',
            prizePool: '₹1,500',
            entryFee: '₹50 / team',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeCujORyc-wiRx917dg-GkGsuhCMMZVPHr4xo1_q3c2yINnfQ/viewform?usp=header',
            teamSize: '2 Members',
            description: 'A high-stakes, knockout-style tournament where mixed teams must demonstrate precision and speed within a strict 15-minute blitz window. Success depends on strategic puck control and scoring efficiency to outpace the opposition before the buzzer sounds.',
            rules: [
                'Match Duration: 15 minutes',
                'Scoring: Black coin – 1 point',
                'Scoring: White coin – 1 point',
                'Scoring: Red coin (Queen) – 3 points (if pocketed by winning team)',
                'Fouls, penalties, and special rules will be announced later'
            ],
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Sasikanth GM ', phone: '+91 8270265924' },
                { name: 'Sharan Adithya S', phone: '+91 7548842533' },
                { name: 'Karthick SR', phone: '+91 9080095947' }
            ]
        },
        'Chess': {
            title: 'Chess: The Grandmaster Protocol',
            subtitle: 'STRATEGIC MIND GAME',
            badge: 'STRATEGY',
            prizePool: '₹1,500',
            entryFee: '₹50 / Participant',
            teamSize: 'Individual',
            description: 'Enter a high-stakes arena of foresight and cognitive endurance. This tournament is designed to test a player’s ability to calculate under pressure and outmaneuver rivals in a battle of pure logic. This event follows a competitive hierarchy system where every move dictates the path to victory or defeat.',
            rules: [
                'FIDE Standards: The latest FIDE Rules in force shall apply throughout the tournament.',
                'Time Control: Each match is strictly timed at 20 minutes (10 minutes per player).',
                'Registration: Both Online and On-Spot registrations are accepted.',
                'Entry Protocol: A registration fee of ₹50 is mandatory for all participants.',
                'Arbitration: The Arbiter’s decision is final and binding in all match scenarios.',
                'Certification: Participation certificates will be awarded to all registered players.',
                'Finality: Prize distribution will take place immediately at the conclusion of the event.'
            ],
            image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Kanishkar S', phone: '7418994553' },
                { name: 'Suganthan S', phone: '8668043389' }
            ]
        },
        'Quizify': {
            title: 'Quizify',
            subtitle: 'Knowledge Battle',
            badge: 'TRIVIA',
            prizePool: '₹8,000+',
            entryFee: '₹50 / team',
            regLink: 'https://docs.google.com/forms/d/e/1FAIpQLScrnKgmu8V4mpwp8e_qgt-_zdUhL9UYCrFaPr_rVVgDnPs_iQ/viewform?usp=header',
            teamSize: '2-3 Members',
            description: 'Quizify is a general quiz hosted in 2 rounds. The quiz consists of questions from general fields such as current affairs, sports, movies, technology, business and many more.',
            rules: ['Each team consists of 2-3 members.',
                    'Individual participation is allowed.',
                    'First round consists of 20 questions.',
                    'Second round consists of 15 questions.',
                    'The final score will be a consolidation of both rounds.'],
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Kritheeka K', phone: '+91 9679523479' },
                { name: 'Mithula C', phone: '+91 8056666226' },
                { name: 'Sasikanth G M', phone: '+91 8270265924' }
            ]
        },
        'IPL Auction': {
            title: 'IPL Auction',
            subtitle: 'The Strategic Face-off',
            badge: 'MANAGEMENT',
            prizePool: '₹1,500+',
            teamSize: '3-5 Members',
            entryFee: '₹99 / team',
            regLink: '',
            description: 'A high-stakes bidding war where teams must balance a massive budget with statistical analysis to build a champion roster. Participants will step into the shoes of franchise owners, using historical data and tactical foresight to outmaneuver rivals in a premium auction environment.',
            rules: [
                'Participation: Open to 12 teams with a mandatory composition of 3–5 members per squad.',
                'Budgetary Constraints: Every team is allocated a virtual purse of ₹80 Crore; exceeding this limit results in disqualification.',
                'Roster Requirements: Teams must secure a minimum of 8 players and a maximum of 10 players to complete their squad.',
                'Player Valuation: Selection is guided by "Player Points" based on 5-year performance data from T20Is and the IPL.',
                'Auction Protocol: Standard bidding increments apply; the highest bidder at the fall of the hammer secures the player.',
                'Entry Requirement: A registration fee of ₹150 per team must be settled prior to the commencement.'
            ],
            image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Dharun', phone: '+91 9361940800' },
                { name: 'Abinanthan', phone: '+91 9344236570' },
                { name: 'Afrith Ahmed', phone: '+91 63824 95941' }
            ]
        },
        'Free Fire': {
            title: 'Free Fire',
            subtitle: 'BATTLE ROYALE TO CLASH SQUAD',
            badge: 'ESPORTS',
            prizePool: '₹22,000+',
            teamSize: 'Squad (4 Members)',
            entryFee: '₹50 / team',
            description: 'Experience the ultimate test of combat prowess in a high-stakes transition from tactical Battle Royale to intense Clash Squad finishers. Teams must first master the art of survival and elimination on the large map to earn their place in the final high-speed close-quarters showdown. This dual-format tournament identifies the most versatile squad capable of dominating both long-range strategy and face-to-face combat.',
            rules: [
                'Qualifying Stage: Points Table System based on Placement and Elimination (Kill) points.',
                'Revival Restriction: Use of Revive Cards or Revive Centers results in immediate disqualification.',
                'Qualifying Advancement: Only the Top 4 teams from the points table advance to the Final Stage.',
                'Final Stage (Clash Squad): Strictly Face-to-Face combat; no rooftop camping or Gloo Wall jumping.',
                'Equipment (Finals): Gun Attributes, Loadouts, and Airdrops are completely disabled.',
                'Gloo Wall Ethics: Breaking or destroying an opponent’s Gloo Wall is strictly prohibited and jumping into the gloo wall is also strictly prohibited.',
                'Tactical Limits: Grenades are restricted; however, unlimited ammo and standard throwables are enabled.'
            ],
            image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=2070&auto=format&fit=crop',
            coordinators: [
                { name: 'Kamalesh', phone: '+91 8220595213' },
                { name: 'Jeyan babu', phone: '+91 7339356572' }
            ]
        },
        'E-Football': {
            title: 'E-Football',
            subtitle: 'Virtual Football',
            badge: 'ESPORTS',
            prizePool: '₹12,500+',
            teamSize: 'Individual',
            entryFee: '₹50 / team',
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
            const standardElements = document.querySelectorAll('#rules-toggle-btn, .flex-wrap.gap-4');
            standardElements.forEach(el => {
                el.style.opacity = isCombo ? '0' : '1';
                el.style.pointerEvents = isCombo ? 'none' : 'auto';
                el.style.visibility = isCombo ? 'hidden' : 'visible';
            });
            // --- 3. APPLY CATEGORY SPECIFIC THEMES & BACKGROUNDS ---
            const regBtn = modal.querySelector('.cosmic-btn');
            
            if (category === 'tech') {
                modal.classList.add('theme-tech');
                document.querySelectorAll('.modal-bg-mesh-tech, .modal-blob-tech').forEach(el => el.classList.remove('hidden'));            } 
            else if (category === 'non-tech') {
                modal.classList.add('theme-non-tech');
                document.querySelectorAll('.modal-stars-bg, .modal-blob-nebula').forEach(el => el.classList.remove('hidden'));            } 
            else if (category === 'flagship') {
                modal.classList.add('theme-flagship');
                document.querySelectorAll('.modal-bg-flagship, .modal-blob-flagship').forEach(el => el.classList.remove('hidden'));            }
            else if (category === 'combo') {
                modal.classList.add('theme-combo');
                document.querySelectorAll('.modal-stars-bg, .modal-blob-nebula').forEach(el => el.classList.remove('hidden'));                
                // ADD THIS FIX HERE:
                activeRegLink = data.regLink; 
            }
            // --- 4. POPULATE CONTENT ---
            modalTitle.textContent = data.title;
            modalSubtitle.textContent = data.subtitle;
            modalBadge.textContent = data.badge;
            modalDescription.textContent = data.description;
            modalImage.style.backgroundImage = `url('${data.image}')`;

            const rulebookContainer = document.getElementById('rulebook-container');
            const rulebookLink = document.getElementById('modal-rulebook-link');

            if (data.rulebook) {
                rulebookContainer.classList.remove('hidden'); 
                rulebookLink.href = data.rulebook;
                
                const icon = rulebookLink.querySelector('i');
                if (data.rulebook.endsWith('.docx')) {
                    icon.className = 'fas fa-file-word text-blue-400 text-xl group-hover:scale-110 transition-transform';
                } else {
                    icon.className = 'fas fa-file-pdf text-red-400 text-xl group-hover:scale-110 transition-transform';
                }
            } else {
                rulebookContainer.classList.add('hidden'); 
            }

            // Inside the card click event listener in script.js
            if (!isCombo) {
                document.getElementById('modal-prize-pool').textContent = data.prizePool || 'TBA';
                document.getElementById('modal-team-size').textContent = data.teamSize || 'TBA';
                document.getElementById('modal-entry-fee').textContent = data.entryFee || 'Free'; // Add this line
                
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

        // Inside the card click event listener in script.js
const coordContainer = document.getElementById('modal-coordinators');

if (data.coordinators && data.coordinators.length > 0) {
    coordContainer.innerHTML = data.coordinators.map(person => `
        <div class="bg-white/5 p-3 rounded-xl border border-white/10">
            <p class="text-white font-semibold text-sm">${person.name}</p>
            <p class="text-blue-400 text-xs font-mono mt-1">
                ${person.phone}
            </p>
        </div>
    `).join('');
} else {
    coordContainer.innerHTML = '<p class="text-gray-500 text-sm italic">Coordinator details TBA</p>';
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
const proceedRegBtn = document.getElementById('proceed-reg-link');
const eventModalRegBtn = document.querySelector('#event-modal .cosmic-btn');

let activeRegLink = ""; // Temporary storage for the current event's link
const comboTriggerEvents = ['Circuit Wars', 'Lab Lockdown', 'Coding Marathon', 'Prompt Verse', 'Carrom'];

eventModalRegBtn.addEventListener('click', (e) => {
    // 1. Stop any default behavior
    e.preventDefault(); 
    e.stopPropagation();
    const currentEventTitle = document.getElementById('modal-title').textContent.trim();
    const data = eventData[currentEventTitle];
    
    if (data && data.regLink) {
        activeRegLink = data.regLink;

        // 2. Check if we should show the verification popup
        if (comboTriggerEvents.includes(currentEventTitle)) {
            verifyModal.classList.remove('hidden'); 
            // The function stops here for these events. No window.open happens.
        } else {
            // 3. For normal events, redirect immediately
            window.open(activeRegLink, '_blank');
        }
    }else {
        // This will help you debug if a link is missing
        console.error("Missing registration link for: " + data);
        alert("Registration link for " + currentEventTitle + " is being updated. Please try again later.");
    }
});

// 4. Handle redirection from the Verification Popup
proceedRegBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeRegLink) {
        window.open(activeRegLink, '_blank');
        verifyModal.classList.add('hidden');
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

