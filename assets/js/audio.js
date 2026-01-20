// Audio system

// Volumes (0.0 à 1.0)
const SOUND_VOLUMES = {
    master: 0.5,        // Main volume
    hover: 0.1,         // Hover sound
    click: 0.3,         // Click sound
    whoosh: 0.75,       // Navigation sound
    success: 0.4,       // Success sound
    error: 0.3,         // Error sound
    glitch: 0.2,        // Glitch sound
    type: 0.05,         // Typing sound
    ambient: 1          // Ambient music
};

class CyberpunkAudio {
    constructor() {
        this.enabled = false;
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.volumes = SOUND_VOLUMES;
        this.ambientPlaying = false;
    }
    
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volumes.master;
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    toggle() {
        if (!this.initialized) {
            this.init();
        }
        this.enabled = !this.enabled;
        
        if (this.enabled && this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
        
        return this.enabled;
    }
    
    // Hover sound
    playHover() {
        if (!this.enabled || !this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(this.volumes.hover, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.05);
    }
    
    // Click sound
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.type = 'square';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(this.volumes.click, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.1);
    }
    
    // Son whoosh (transitions)
    playWhoosh() {
        if (!this.enabled || !this.audioContext) return;
        
        const noise = this.createNoise(0.5);
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(150, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, this.audioContext.currentTime + 0.2);
        filter.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.5);
        filter.Q.value = 2;
        
        gain.gain.setValueAtTime(this.volumes.whoosh, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.5);
    }
    
    // Success sound
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
        
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const startTime = this.audioContext.currentTime + (i * 0.08);
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.volumes.success, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }
    
    // Error sound
    playError() {
        if (!this.enabled || !this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(this.volumes.error, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.2);
    }
    
    // Glitch sound
    playGlitch() {
        if (!this.enabled || !this.audioContext) return;
        
        const noise = this.createNoise(0.1);
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        filter.type = 'highpass';
        filter.frequency.value = 3000;
        
        gain.gain.setValueAtTime(this.volumes.glitch, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.1);
    }
    
    // Typing sound
    playType() {
        if (!this.enabled || !this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.value = 800 + Math.random() * 400;
        osc.type = 'square';
        
        gain.gain.setValueAtTime(this.volumes.type, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.02);
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.02);
    }
    
    // Lofi music
    startAmbient() {
        if (!this.enabled || !this.audioContext || this.ambientPlaying) return;
        this.ambientPlaying = true;
        
        // BPM
        this.bpm = 70;
        this.beatInterval = 60000 / this.bpm;
        
        // Master gain
        this.ambientMaster = this.audioContext.createGain();
        this.ambientMaster.connect(this.masterGain);
        this.ambientMaster.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.ambientMaster.gain.linearRampToValueAtTime(this.volumes.ambient, this.audioContext.currentTime + 2);
        
        // Vinyl crackle
        this.vinylNoise = this.createVinylCrackle();
        const vinylGain = this.audioContext.createGain();
        vinylGain.gain.value = 0.08;
        
        const vinylFilter = this.audioContext.createBiquadFilter();
        vinylFilter.type = 'bandpass';
        vinylFilter.frequency.value = 3000;
        vinylFilter.Q.value = 0.5;
        
        this.vinylNoise.connect(vinylFilter);
        vinylFilter.connect(vinylGain);
        vinylGain.connect(this.ambientMaster);
        this.vinylNoise.start();
        
        // Accords jazz
        this.chordProgressions = [
            [146.83, 174.61, 220.00, 261.63],  // Dm7
            [196.00, 246.94, 293.66, 349.23],  // G7
            [130.81, 164.81, 196.00, 246.94],  // Cmaj7
            [220.00, 261.63, 329.63, 392.00]   // Am7
        ];
        this.currentChord = 0;
        this.chordOscillators = [];
        
        this.chordGain = this.audioContext.createGain();
        this.chordGain.gain.value = 0.15;
        
        this.lofiFilter = this.audioContext.createBiquadFilter();
        this.lofiFilter.type = 'lowpass';
        this.lofiFilter.frequency.value = 800;
        this.lofiFilter.Q.value = 1;
        
        this.chordGain.connect(this.lofiFilter);
        this.lofiFilter.connect(this.ambientMaster);
        
        this.playLofiChord();
        
        this.chordInterval = setInterval(() => {
            if (!this.ambientPlaying) return;
            this.currentChord = (this.currentChord + 1) % this.chordProgressions.length;
            this.playLofiChord();
        }, this.beatInterval * 4);
        
        // Bass notes
        this.bassNotes = [146.83, 196.00, 130.81, 220.00];
        this.bassGain = this.audioContext.createGain();
        this.bassGain.gain.value = 0.25;
        
        const bassFilter = this.audioContext.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.value = 300;
        
        this.bassGain.connect(bassFilter);
        bassFilter.connect(this.ambientMaster);
        
        this.playLofiBass();
        this.bassInterval = setInterval(() => {
            if (!this.ambientPlaying) return;
            this.playLofiBass();
        }, this.beatInterval * 4);
        
        // Kick sound
        this.kickInterval = setInterval(() => {
            if (!this.ambientPlaying) return;
            this.playLofiKick();
        }, this.beatInterval);
        
        // Hi-hat sound
        this.hihatInterval = setInterval(() => {
            if (!this.ambientPlaying) return;
            this.playLofiHihat();
        }, this.beatInterval / 2);
        
        // Melody
        this.melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        this.melodyInterval = setInterval(() => {
            if (!this.ambientPlaying) return;
            if (Math.random() > 0.4) {
                this.playLofiMelody();
            }
        }, this.beatInterval * 2);
        
        console.log('🎧 Lofi hip-hop started ~ chill vibes ☕');
    }
    
    playLofiChord() {
        this.chordOscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.chordOscillators = [];
        
        const chord = this.chordProgressions[this.currentChord];
        const now = this.audioContext.currentTime;
        
        chord.forEach((freq) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            osc.detune.value = (Math.random() - 0.5) * 10;
            
            osc.connect(gain);
            gain.connect(this.chordGain);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
            gain.gain.linearRampToValueAtTime(0.2, now + (this.beatInterval * 4 / 1000));
            
            osc.start(now);
            this.chordOscillators.push(osc);
        });
    }
    
    playLofiBass() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = this.bassNotes[this.currentChord] / 2;
        osc.type = 'sine';
        
        osc.connect(gain);
        gain.connect(this.bassGain);
        
        const now = this.audioContext.currentTime;
        const duration = this.beatInterval * 3.5 / 1000;
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
    }
    
    playLofiKick() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.ambientMaster);
        
        const now = this.audioContext.currentTime;
        
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }
    
    playLofiHihat() {
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        
        const gain = this.audioContext.createGain();
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientMaster);
        
        const now = this.audioContext.currentTime;
        const swing = Math.random() > 0.5 ? 0.05 : 0.03;
        
        gain.gain.setValueAtTime(swing, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        noise.start(now);
    }
    
    playLofiMelody() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        const note = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
        osc.frequency.value = note;
        osc.type = 'triangle';
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientMaster);
        
        const now = this.audioContext.currentTime;
        const duration = (this.beatInterval * (1 + Math.random())) / 1000;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
    }
    
    createVinylCrackle() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            if (Math.random() > 0.97) {
                output[i] = (Math.random() - 0.5) * 0.5;
            } else {
                output[i] = (Math.random() - 0.5) * 0.02;
            }
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        return noise;
    }
    
    stopAmbient() {
        if (this.ambientPlaying) {
            this.ambientMaster.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
            
            clearInterval(this.chordInterval);
            clearInterval(this.bassInterval);
            clearInterval(this.kickInterval);
            clearInterval(this.hihatInterval);
            clearInterval(this.melodyInterval);
            
            setTimeout(() => {
                this.chordOscillators?.forEach(osc => {
                    try { osc.stop(); } catch(e) {}
                });
                this.chordOscillators = [];
                
                try { this.vinylNoise?.stop(); } catch(e) {}
                
                this.ambientPlaying = false;
                console.log('🔇 Lofi music stopped');
            }, 2000);
        }
    }
    
    createNoise(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }
}

const cyberpunkAudio = new CyberpunkAudio();

// Toggle son
function initSoundToggle() {
    const soundToggle = document.querySelector('.sound-toggle');
    if (!soundToggle) return;
    
    soundToggle.addEventListener('click', () => {
        const enabled = cyberpunkAudio.toggle();
        soundToggle.querySelector('.sound-icon').textContent = enabled ? '🔊' : '🔇';
        
        if (enabled) {
            cyberpunkAudio.playSuccess();
            setTimeout(() => cyberpunkAudio.startAmbient(), 500);
        } else {
            cyberpunkAudio.stopAmbient();
        }
    });
    
    initSoundEffects();
}

function initSoundEffects() {
    // Click sounds on CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-submit, .nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cyberpunkAudio.playClick();
        });
    });
    
    // Navigation whoosh sounds
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            cyberpunkAudio.playWhoosh();
        });
    });
    
    // Form success sound
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', () => {
            setTimeout(() => {
                cyberpunkAudio.playSuccess();
            }, 2000);
        });
    }
}
