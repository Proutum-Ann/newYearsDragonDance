const rhythm_app = Vue.createApp({
    created () {
        fetch('avatars.json').then(response => response.json()).then(json => {
           this.avatars = json
      })
   },
    data() {
        return {
            avatars: [],
            gameStarted: false,
            gamePaused: false,
            score: 0,
            combo: 0,
            maxCombo: 0,
            totalNotes: 0,
            hitNotes: 0,
            lastHit: '',
            lastHitText: '',
            keysPressed: [],
            lanes: [[], [], [], []], // 4 lanes for A, S, D, F
            gameTime: 0,
            noteId: 0,
            gameLoop: null,
            hitFeedbackTimeout: null
        }
    },
    computed: {
        accuracy() {
            if (this.totalNotes === 0) return 0;
            return Math.round((this.hitNotes / this.totalNotes) * 100);
        },
        sprite() {
            const pressed = e.key.toLowerCase()
            const cSprite = ""
            if (!['a', 's', 'd', 'f'].includes(pressed)) {
                cSprite = this.sprites[4];
            } else if (['a'].includes(pressed)) {
                cSprite = this.sprites[0];
            } else if (['s'].includes(pressed)) {
                cSprite = this.sprites[2];
            }
        }
    },
    methods: {
        startGame() {
            this.gameStarted = true;
            this.gamePaused = false;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.totalNotes = 0;
            this.hitNotes = 0;
            this.gameTime = 0;
            
            // Clear existing notes
            this.lanes = [[], [], [], []];
            
            // Start spawning notes
            this.spawnNotes();
        },
        pauseGame() {
            this.gamePaused = !this.gamePaused;
        },
        resetGame() {
            this.gameStarted = false;
            this.gamePaused = false;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.totalNotes = 0;
            this.hitNotes = 0;
            this.gameTime = 0;
            this.lanes = [[], [], [], []];
            this.lastHitText = '';
            
            if (this.gameLoop) {
                cancelAnimationFrame(this.gameLoop);
            }
        },
        spawnNotes() {
            if (!this.gameStarted) return;
            
            // Spawn random notes every 500ms
            const randomLane = Math.floor(Math.random() * 4);
            this.lanes[randomLane].push({
                id: this.noteId++,
                position: -50,
                hit: false
            });
            
            this.totalNotes++;
            
            setTimeout(() => this.spawnNotes(), 500);
        },
        updateGame() {
            if (!this.gameStarted || this.gamePaused) {
                this.gameLoop = requestAnimationFrame(() => this.updateGame());
                return;
            }
            
            this.gameTime += 16; // ~60fps
            
            // Move notes down
            for (let i = 0; i < 4; i++) {
                this.lanes[i].forEach((note, index) => {
                    note.position += 5; // Speed of notes falling
                    
                    // Remove notes that went past the hit zone
                    if (note.position > 600) {
                        if (!note.hit) {
                            this.combo = 0;
                            this.showFeedback('MISSED', 'missed');
                        }
                        this.lanes[i].splice(index, 1);
                    }
                });
            }
            
            this.gameLoop = requestAnimationFrame(() => this.updateGame());
        },
        handleKeyDown(e) {
            const key = e.key.toLowerCase();
            
            if (!['a', 's', 'd', 'f'].includes(key)) return;
            
            e.preventDefault();
            
            if (!this.keysPressed.includes(key)) {
                this.keysPressed.push(key);
            }
            
            // Get lane index
            const laneIndex = { 'a': 0, 's': 1, 'd': 2, 'f': 3 }[key];
            
            // Check for note collision in hit zone (between 500-600px)
            let hitNote = false;
            this.lanes[laneIndex].forEach((note, index) => {
                if (!note.hit && note.position > 480 && note.position < 600) {
                    note.hit = true;
                    hitNote = true;
                    
                    // Calculate accuracy
                    const distance = Math.abs(note.position - 540);
                    let points = 0;
                    let feedback = '';
                    
                    if (distance < 30) {
                        points = 100;
                        feedback = 'PERFECT';
                        this.combo++;
                        this.hitNotes++;
                    } else if (distance < 60) {
                        points = 75;
                        feedback = 'GOOD';
                        this.combo++;
                        this.hitNotes++;
                    } else if (distance < 90) {
                        points = 50;
                        feedback = 'OK';
                        this.combo++;
                        this.hitNotes++;
                    } else {
                        feedback = 'LATE';
                        this.combo = 0;
                    }
                    
                    this.score += points;
                    if (this.combo > this.maxCombo) {
                        this.maxCombo = this.combo;
                    }
                    
                    this.showFeedback(feedback, feedback.toLowerCase());
                    
                    // Remove note after short delay
                    setTimeout(() => {
                        const noteIndex = this.lanes[laneIndex].indexOf(note);
                        if (noteIndex > -1) {
                            this.lanes[laneIndex].splice(noteIndex, 1);
                        }
                    }, 100);
                }
            });
            
            if (!hitNote && this.gameStarted) {
                this.combo = 0;
                this.showFeedback('MISSED', 'missed');
            }
        },
        handleKeyUp(e) {
            const key = e.key.toLowerCase();
            const index = this.keysPressed.indexOf(key);
            if (index > -1) {
                this.keysPressed.splice(index, 1);
            }
        },
        showFeedback(text, className) {
            this.lastHitText = text;
            this.lastHit = className;
            
            clearTimeout(this.hitFeedbackTimeout);
            this.hitFeedbackTimeout = setTimeout(() => {
                this.lastHitText = '';
                this.lastHit = '';
            }, 300);
        }
    },
    mounted() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start game loop
        this.gameLoop = requestAnimationFrame(() => this.updateGame());
    },
    beforeUnmount() {
        window.removeEventListener('keydown', (e) => this.handleKeyDown(e));
        window.removeEventListener('keyup', (e) => this.handleKeyUp(e));
        
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
    }
});

rhythm_app.mount('#rhythm_app');