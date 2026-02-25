/**
 * Audio Manager
 * Handles music and sound effects using Web Audio API
 */

export class Audio {
    constructor(assetLoader) {
        this.assets = assetLoader;

        // Audio context (created on user interaction)
        this.audioContext = null;

        // Currently playing music
        this.currentMusic = null;
        this.currentMusicKey = null;
        this.musicPaused = false;

        // Volume settings
        this.masterVolume = 1.0;
        this.musicVolume = 0.7;
        this.sfxVolume = 1.0;
        this.muted = false;

        // Audio pools for frequently used SFX
        this.sfxPools = new Map();
        this.poolSize = 5;

        // Initialize audio context on first interaction
        this.initPromise = null;
        this.setupUserInteraction();
    }

    /**
     * Set up user interaction to unlock audio
     */
    setupUserInteraction() {
        const unlock = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Remove listeners after first interaction
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };

        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
        document.addEventListener('keydown', unlock);
    }

    /**
     * Play background music
     */
    playMusic(key, loop = true) {
        // Stop current music
        this.stopMusic();

        // Get audio element
        const audio = this.assets.getAudio(key);
        if (!audio) {
            console.warn(`Music not found: ${key}`);
            return;
        }

        // Clone audio element
        this.currentMusic = audio.cloneNode();
        this.currentMusicKey = key;
        this.currentMusic.loop = loop;
        this.currentMusic.volume = this.getMusicVolume();

        // Play
        this.currentMusic.play().catch(e => {
            console.warn('Music playback failed:', e);
        });
    }

    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
            this.currentMusicKey = null;
        }
    }

    /**
     * Pause current music
     */
    pauseMusic() {
        if (this.currentMusic && !this.musicPaused) {
            this.currentMusic.pause();
            this.musicPaused = true;
        }
    }

    /**
     * Resume current music
     */
    resumeMusic() {
        if (this.currentMusic && this.musicPaused) {
            this.currentMusic.play().catch(e => {
                console.warn('Music resume failed:', e);
            });
            this.musicPaused = false;
        }
    }

    /**
     * Play a sound effect
     */
    playSFX(key) {
        if (this.muted) return;

        const audio = this.assets.getAudio(key);
        if (!audio) {
            // Silently fail for missing SFX during development
            return;
        }

        // Clone and play
        const sfx = audio.cloneNode();
        sfx.volume = this.getSFXVolume();
        sfx.play().catch(e => {
            // Silent fail - common during rapid interactions
        });
    }

    /**
     * Get effective music volume
     */
    getMusicVolume() {
        return this.muted ? 0 : this.masterVolume * this.musicVolume;
    }

    /**
     * Get effective SFX volume
     */
    getSFXVolume() {
        return this.muted ? 0 : this.masterVolume * this.sfxVolume;
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
    }

    /**
     * Set SFX volume
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Update currently playing music volume
     */
    updateMusicVolume() {
        if (this.currentMusic) {
            this.currentMusic.volume = this.getMusicVolume();
        }
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.muted = !this.muted;
        this.updateMusicVolume();
        return this.muted;
    }

    /**
     * Set mute state
     */
    setMuted(muted) {
        this.muted = muted;
        this.updateMusicVolume();
    }
}
