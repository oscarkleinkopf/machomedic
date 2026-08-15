/* ==========================================================================
   MachoMedic - Core Logic & Interactive Engine
   ========================================================================= */

// State Management
let state = {
  willToLive: 100,             // 0 to 100%
  deathTimeLeft: 16200,        // 4.5 hours in seconds
  symptoms: [],                // { id, type, name, drama, time }
  medications: [],             // { id, name, interval, secondsLeft, active }
  will: null,                  // { name, consola, culpable, words, date }
  speechEnabled: true,
  sportsOn: false,             // Phase 2: Fifa-O-Meter
  temperature: 36.5            // Phase 2: temperature
};

// Database of Sydney Sweeney Ironic Quotes
const SYDNEY_QUOTES = {
  stable: [
    "Ay, pobrecito, un estornudo. ¿Llamo a una ambulancia de terapia intensiva o crees poder resistir hasta el almuerzo?",
    "Sé lo duro que es, mi amor. Apenas una basurita en el ojo y ya tu vida pende de un hilo. Eres un soldado muy valiente.",
    "No temas, mi guerrero del sofá. Ya le escribí a tus amigos del FIFA para avisarles que estás librando tu batalla más difícil.",
    "¿Un dolorcito de cabeza? Pobrecito mi bebé gigante. Quédate acostado, yo iré a buscarte el control de la tele.",
    "Vaya, un estornudo ocasional. Eres oficialmente un sobreviviente. Escribiré un libro sobre tu inmenso coraje."
  ],
  warning: [
    "¿37.1 grados de temperatura? ¡Dios mío, eso es prácticamente fiebre del desierto! ¡No cierres los ojos, quédate conmigo!",
    "Tu garganta tiene una ligera molestia. Es el fin, lo sé. ¿Quieres que rece por tu alma o le hablo a tu mami?",
    "Ya he preparado el altar de veladoras. Todo va a estar bien, mi dramático moribundo. Mantén la fe.",
    "Tranquilo, respira hondo. Si te asfixias por esa sutil congestión nasal, yo me aseguraré de cuidar tu PlayStation 5.",
    "El dolor se ve terrible en tu cara (aunque tu pulso esté perfecto). Te traeré una cobijita y tres almohadas más."
  ],
  critical: [
    "¡CÓDIGO ROJO! ¡CÓDIGO ROJO! ¡Traigan una sopita de pollo caliente o este hombre no pasa de la noche!",
    "Tu pulso se siente sospechosamente normal, pero sé que en tu mente estás cruzando el inframundo. ¡Fuerza, campeón!",
    "No te nos vayas todavía. Con 37.2°C de fiebre tienes toda una vida de quejarte por dolores inexistentes por delante.",
    "Ya tengo el testamento a la mano. Por favor firma aquí antes de que tus dedos pierdan la fuerza por el resfriado mortal.",
    "¿Fatiga terminal? Entiendo perfectamente. El esfuerzo de haber ido al baño tú solo te ha dejado al borde del colapso."
  ],
  mimos: [
    "Ay, pobrecito... (te doy una palmadita en la espalda). Listo, ya eres un niño grande, ahora ve a ver el fútbol.",
    "Pobrecito mi bebé. ¿Quieres que le sople a tu heridita invisible? Fffff... ya, curado por arte de magia.",
    "Eres el hombre más fuerte del mundo por soportar una tos ocasional. Te mereces dos horas de mimos y una cerveza helada.",
    "Ay mi amor, si te duele la garganta no hables. Solo apunta con el dedo lo que quieres que te traiga de la nevera.",
    "¡Eres todo un espartano! Tomaste un té caliente sin quemarte la lengua. Te mereces un trofeo al valor."
  ],
  elixir: [
    "¡Un milagro de la ciencia! Esa gominola de Vitamina C ha salvado tu alma del abismo. Anótalo en la consola, Señora.",
    "Caldo de pollo ingerido. El elixir ancestral materno restaura funciones vitales… unos diez minutos, máximo. Próxima dosis cuando diga el timer.",
    "¡Qué valiente! Te tomaste esa pastilla gigante de Paracetamol sin llorar (bueno, solo un poquito). La Señora ya puede dejar de preguntar… hasta la próxima alerta.",
    "Abrazo sanador aplicado. La ciencia no explica cómo sigues vivo, pero el recordatorio de pastilla sí. ¡Sigue luchando, drama king!"
  ]
};

// Exaggerated Symptom Names translation mapper
const SYMPTOM_DATA = {
  estornudo: { name: "Estornudo Explosivo", damage: 15, msg: "Sospecha de colapso pulmonar y pérdida de costilla." },
  temperatura: { name: "Fiebre Extrema 37.1°C", damage: 25, msg: "Temperatura desértica mortal, hipotermia inminente." },
  garganta: { name: "Garganta de Vidrio", damage: 18, msg: "Sensación de tragar fragmentos de vidrio volcánico." },
  mocos: { name: "Asfixia por Congestión", damage: 12, msg: "Mucosidad sutil que bloquea el 99% del flujo de oxígeno." },
  fatiga: { name: "Parálisis de Sofá", damage: 20, msg: "Fatiga terminal. Incapacidad absoluta para levantar el control remoto." },
  escalofrio: { name: "Hipotermia Grado 4", damage: 10, msg: "Escalofrío de 1 segundo. Riesgo de congelación de extremidades." },
  tos: { name: "Tuberculosis Instantánea", damage: 15, msg: "Tos ocasional que suena a último aliento dramático." }
};

// Canvas Particle System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'heart', 'pill', 'skull'
    this.size = Math.random() * 15 + 10;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * -3 - 2;
    this.gravity = 0.05;
    this.opacity = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.opacity -= 0.015;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    if (this.type === 'heart') {
      ctx.fillStyle = '#ff3366';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, 0, 0, this.size);
      ctx.bezierCurveTo(this.size, 0, this.size/2, -this.size/2, 0, 0);
      ctx.fill();
    } else if (this.type === 'pill') {
      // Draw capsule
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(-this.size/2, -this.size/4, this.size, this.size/2, this.size/4);
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'skull') {
      // Draw simplified skull emoji or drawing
      ctx.font = `${this.size}px Arial`;
      ctx.fillText('💀', -this.size/2, this.size/2);
    }

    ctx.restore();
  }
}

function spawnParticles(x, y, type, count = 20) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, type));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.opacity > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Synth Alarm Beep (Web Audio API)
function playBeepAlarm() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play double emergency beep
    const playTone = (time, pitch, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = pitch;
      
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = audioCtx.currentTime;
    playTone(now, 880, 0.15);
    playTone(now + 0.2, 880, 0.15);
  } catch (e) {
    console.log("AudioContext blocked or unsupported", e);
  }
}

// Helper to robustly find a female Spanish voice across different browsers
function getFemaleSpanishVoice(voices) {
  const spanishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('es'));
  if (spanishVoices.length === 0) return null;

  // Score each voice to identify the best female option
  const scoredVoices = spanishVoices.map(voice => {
    const nameLower = voice.name.toLowerCase();
    let score = 0;

    // Keywords that strongly indicate a female voice
    const femaleKeywords = [
      'female', 'woman', 'mujer', 'chica', 'sabina', 'monica', 'mónica', 'helena', 'elena', 
      'maria', 'maría', 'conchita', 'luz', 'paula', 'soledad', 'francisca', 'sandra', 'lola', 
      'juana', 'isabela', 'sofia', 'sofía', 'sara', 'laura', 'carmen', 'catalina', 'victoria', 
      'paola', 'valeria', 'lorena', 'lucia', 'lucía', 'elvira', 'dalia', 'hilda', 'salome', 
      'salomé', 'sharik', 'paulina', 'marisol', 'zira', 'daria', 'penelope', 'penélope', 'zuri'
    ];

    // Keywords that indicate a male voice
    const maleKeywords = [
      'male', 'man', 'hombre', 'chico', 'david', 'julio', 'mateo', 'pablo', 'alvaro', 'álvaro', 
      'jacobo', 'hector', 'héctor', 'raul', 'raúl', 'miguel', 'enrique', 'carlos', 'jose', 'josé', 
      'juan', 'manuel', 'pedro', 'luis', 'jorge', 'diego', 'tomás', 'tomas', 'javier', 'marcos', 
      'ignacio', 'francisco', 'antonio', 'alejandro', 'fernando', 'andres', 'andrés', 'cristian', 
      'esteban', 'felipe', 'gustavo', 'hugo', 'ivan', 'iván', 'mario', 'oscar', 'óscar', 'ricardo', 
      'roberto', 'santiago', 'sebastian', 'sebastián', 'sergio', 'victor', 'víctor'
    ];

    if (femaleKeywords.some(kw => nameLower.includes(kw))) {
      score += 100;
    }

    // Google female voices usually specify the country with "de" (e.g. "Google español de España", "Google español de México")
    const googleFemaleKeywords = [
      'de españa', 'de espana', 'de méxico', 'de mexico', 'de estados unidos', 'de colombia', 'de argentina'
    ];
    if (googleFemaleKeywords.some(kw => nameLower.includes(kw))) {
      score += 50;
    }

    if (maleKeywords.some(kw => nameLower.includes(kw))) {
      score -= 200;
    }

    // Chrome/Android specific: "google español" or "google espanol" without country suffix "de ..." is male
    if ((nameLower === 'google español' || nameLower === 'google espanol') ||
        ((nameLower.includes('google español') || nameLower.includes('google espanol')) && !nameLower.includes(' de '))) {
      score -= 150;
    }

    return { voice, score };
  });

  // Sort descending by score
  scoredVoices.sort((a, b) => b.score - a.score);

  console.log("Scored Spanish voices:", scoredVoices.map(sv => `${sv.voice.name} (${sv.voice.lang}) -> Score: ${sv.score}`));

  return scoredVoices[0].voice;
}

// Speech Synthesis Engine representing Sydney Sweeney
function speakText(text) {
  if (!state.speechEnabled) return;
  
  // Cancel current speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  
  // Set voice profile
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = getFemaleSpanishVoice(voices);
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  // Sexy, slow, slightly ironic cadence parameters
  utterance.rate = 0.80;  // Sultry, slower cadence
  utterance.pitch = 1.12;  // Warm, sweet, feminine pitch
  
  const avatar = document.getElementById('sydneyAvatar');
  utterance.onstart = () => avatar.classList.add('talking');
  utterance.onend = () => avatar.classList.remove('talking');
  utterance.onerror = () => avatar.classList.remove('talking');
  
  window.speechSynthesis.speak(utterance);
}

// Load voices once they are ready (Chrome async loading)
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    getFemaleSpanishVoice(voices);
  };
}

let profiles = [];
let currentProfileId = null;

const DEFAULT_STATE = {
  willToLive: 100,             // 0 to 100%
  deathTimeLeft: 16200,        // 4.5 hours in seconds
  symptoms: [],                // { id, type, name, drama, time }
  medications: [],             // { id, name, interval, secondsLeft, active }
  will: null,                  // { name, consola, culpable, words, date }
  speechEnabled: true,
  sportsOn: false,             // Phase 2: Fifa-O-Meter
  temperature: 36.5            // Phase 2: temperature
};

// Save & Load state to localStorage
function saveState() {
  if (currentProfileId) {
    localStorage.setItem(`machomedic_state_${currentProfileId}`, JSON.stringify(state));
  }
}

function saveProfilesList() {
  localStorage.setItem('machomedic_profiles', JSON.stringify(profiles));
  localStorage.setItem('machomedic_current_profile_id', currentProfileId);
}

function loadProfilesAndState() {
  const savedProfiles = localStorage.getItem('machomedic_profiles');
  const savedCurrentId = localStorage.getItem('machomedic_current_profile_id');
  
  if (savedProfiles && savedCurrentId) {
    try {
      profiles = JSON.parse(savedProfiles);
      currentProfileId = parseInt(savedCurrentId);
    } catch(e) {
      console.error("Error loading profiles metadata", e);
    }
  }

  // If no profiles, create a default one
  if (profiles.length === 0 || !currentProfileId) {
    const defaultProfile = { id: Date.now(), name: "Soldado Anónimo" };
    profiles = [defaultProfile];
    currentProfileId = defaultProfile.id;
    saveProfilesList();
  }

  // Load state for current profile
  const savedState = localStorage.getItem(`machomedic_state_${currentProfileId}`);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      // Clean active intervals so we don't duplicate timers
      parsed.medications.forEach(m => {
        m.active = false;
        m.secondsLeft = m.interval;
      });
      state = { ...DEFAULT_STATE, ...parsed };
    } catch (e) {
      state = { ...DEFAULT_STATE };
    }
  } else {
    state = { ...DEFAULT_STATE };
  }
}

// Notification API Setup
const notifBanner = document.getElementById('notifBanner');
const btnEnableNotif = document.getElementById('btnEnableNotif');

function checkNotificationPermission() {
  if (!("Notification" in window)) {
    notifBanner.classList.add('hidden');
    return;
  }
  
  if (Notification.permission === "granted") {
    notifBanner.classList.add('hidden');
  } else if (Notification.permission === "denied") {
    notifBanner.querySelector('.banner-text').innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Notificaciones bloqueadas en el navegador. Por favor, actívalas en la barra de direcciones.';
    btnEnableNotif.classList.add('hidden');
  } else {
    notifBanner.classList.remove('hidden');
  }
}

btnEnableNotif.addEventListener('click', () => {
  Notification.requestPermission().then(permission => {
    checkNotificationPermission();
    if (permission === "granted") {
      new Notification("MachoMedic Activado", {
        body: "La Señora trackea la dosis. Sydney trackea el Oscar al mejor quejido.",
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💖</text></svg>"
      });
    }
  });
});

// Update Survival UI Elements
function updateSurvivalUI() {
  // Clamp value
  state.willToLive = Math.max(0, Math.min(100, state.willToLive));
  
  const willBar = document.getElementById('willToLiveBar');
  const willPercent = document.getElementById('willToLivePercent');
  const statusSummary = document.getElementById('statusSummary');
  const avatar = document.getElementById('sydneyAvatar');
  const overlay = document.getElementById('vitalOverlay');
  const card = document.getElementById('survivalCard') || document.querySelector('.survival-status-card');

  // Color classes and states
  willBar.className = "meter-bar-inner";
  willPercent.className = "meter-percentage";
  overlay.className = "vital-overlay";
  card.className = "survival-status-card glass-panel";

  if (state.sportsOn) {
    willPercent.textContent = `100% (MILAGRO)`;
    willBar.style.width = `100%`;
    willBar.classList.add('champions');
    statusSummary.innerHTML = `<i class="fa-solid fa-trophy text-warning"></i> ¡MILAGRO DEPORTIVO! Hay fútbol o FIFA en la TV. El resfriado mortal ha desaparecido mágicamente de tus células.`;
    avatar.src = "assets/sydney_normal.png";
    overlay.textContent = "CURADO";
    overlay.className = "vital-overlay warning"; // gold color
    state.deathTimeLeft = 999999;
    updateCountdownTimerDisplay();
    return;
  }

  // Update Percentage Text
  willPercent.textContent = `${state.willToLive}%`;
  willBar.style.width = `${state.willToLive}%`;

  const nextMedHint = getNextMedicationHint();

  if (state.willToLive >= 80) {
    willBar.classList.add('success');
    statusSummary.innerHTML = `<i class="fa-solid fa-check-double text-success"></i> Estado estable. Apenas se queja; hay esperanzas de ver el partido.${nextMedHint}`;
    avatar.src = "assets/sydney_normal.png";
    overlay.textContent = "ESTABLE";
  } else if (state.willToLive >= 40) {
    willBar.classList.add('warning');
    willPercent.classList.add('warning');
    statusSummary.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-warning"></i> Síntomas moderados: suspiros profundos y té cada 5 minutos.${nextMedHint}`;
    avatar.src = "assets/sydney_normal.png";
    overlay.textContent = "CUIDADO";
    overlay.classList.add('warning');
  } else {
    willBar.classList.add('danger');
    willPercent.classList.add('critical');
    card.classList.add('critical');
    statusSummary.innerHTML = `<i class="fa-solid fa-skull-crossbones text-danger animate-flash"></i> ¡CÓDIGO ROJO! Pide mamá, cobija y un Oscar.${nextMedHint}`;
    avatar.src = "assets/sydney_concerned.png";
    overlay.textContent = "CRÍTICO";
    overlay.classList.add('critical');
  }

  // Adjust death countdown dynamically based on Will to Live
  // If 100%, death is 4.5 hours (16200s). If 0%, death is imminent (0s).
  // Calculate based on current willToLive
  state.deathTimeLeft = state.willToLive * 162; 
  updateCountdownTimerDisplay();
}

function updateCountdownTimerDisplay() {
  const timerDisplay = document.getElementById('deathCountdown');
  const timerLabel = document.getElementById('deathTimerLabel') || { textContent: '' };
  
  if (state.sportsOn) {
    timerDisplay.textContent = "MILAGRO";
    timerDisplay.style.color = 'var(--color-warning)'; // Gold
    timerLabel.textContent = "ESTADO DEL GUERRERO:";
    return;
  }
  
  timerLabel.textContent = "TIEMPO ESTIMADO DE MUERTE:";
  const hours = Math.floor(state.deathTimeLeft / 3600);
  const minutes = Math.floor((state.deathTimeLeft % 3600) / 60);
  const seconds = state.deathTimeLeft % 60;

  const pad = (num) => String(num).padStart(2, '0');
  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  
  if (state.willToLive <= 30) {
    timerDisplay.style.color = 'var(--color-danger)';
  } else if (state.willToLive <= 70) {
    timerDisplay.style.color = 'var(--color-warning)';
  } else {
    timerDisplay.style.color = 'var(--color-success)';
  }
}

// Timer Ticking Loop
setInterval(() => {
  // Tick death countdown
  if (state.deathTimeLeft > 0) {
    state.deathTimeLeft--;
    // Also slowly decay willToLive if countdown drops below the threshold
    // every 162 seconds, Will to Live drops by 1% naturally.
    if (state.deathTimeLeft % 162 === 0 && state.willToLive > 0) {
      state.willToLive = Math.floor(state.deathTimeLeft / 162);
      updateSurvivalUI();
    }
    updateCountdownTimerDisplay();
  }

  // Tick active medication timers
  state.medications.forEach(med => {
    if (med.secondsLeft > 0) {
      med.secondsLeft--;
      updateMedicationListUI();
      
      // Timer triggers!
      if (med.secondsLeft === 0) {
        triggerMedicationAlert(med);
      }
    }
  });
}, 1000);

// Tab Switching Mechanism
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Update Speech Toggle
const btnToggleSpeech = document.getElementById('btnToggleSpeech');
const speechIcon = document.getElementById('speechIcon');
const audioStatusText = document.querySelector('.audio-status-text');

btnToggleSpeech.addEventListener('click', () => {
  state.speechEnabled = !state.speechEnabled;
  if (state.speechEnabled) {
    speechIcon.className = "fa-solid fa-volume-high";
    audioStatusText.textContent = "Lectura de voz activa";
    speakText("Voz activada. Estoy lista para mimarte, consentido.");
  } else {
    speechIcon.className = "fa-solid fa-volume-xmark";
    audioStatusText.textContent = "Lectura de voz inactiva";
    window.speechSynthesis.cancel();
  }
  saveState();
});

// Click "Mimos Virtuales" Action
const btnMimos = document.getElementById('btnMimos');
btnMimos.addEventListener('click', (e) => {
  // Restore life a small bit
  state.willToLive = Math.min(100, state.willToLive + 5);
  updateSurvivalUI();

  // Dialog quote
  const randomQuote = SYDNEY_QUOTES.mimos[Math.floor(Math.random() * SYDNEY_QUOTES.mimos.length)];
  document.getElementById('sydneySpeech').innerHTML = `"${randomQuote}"`;
  speakText(randomQuote);

  // Particles effect
  const rect = btnMimos.getBoundingClientRect();
  spawnParticles(rect.left + rect.width/2, rect.top, 'heart', 15);
  saveState();
});

// Symptom Form Handler
const symptomForm = document.getElementById('symptomForm');
const dramaSlider = document.getElementById('dramaSlider');
const sliderValue = document.getElementById('sliderValue');

dramaSlider.addEventListener('input', () => {
  const val = parseInt(dramaSlider.value);
  let label = `${val} (Dolor grave)`;
  if (val <= 3) label = `${val} (Agonía controlada)`;
  else if (val <= 6) label = `${val} (Casi en el limbo)`;
  else if (val <= 8) label = `${val} (Escribiendo mi epitafio)`;
  else label = `${val} (Llamen al Papa y a mi mamá)`;
  
  sliderValue.textContent = label;
});

symptomForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const type = document.getElementById('symptomSelect').value;
  const drama = parseInt(dramaSlider.value);
  const data = SYMPTOM_DATA[type];
  
  const newSymptom = {
    id: Date.now(),
    type: type,
    name: data.name,
    drama: drama,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  // Add to state and deduct from life support
  state.symptoms.unshift(newSymptom);
  state.willToLive = Math.max(0, state.willToLive - Math.round(data.damage * (drama / 8)));
  updateSurvivalUI();

  // Speak and trigger Sydney
  let quotePool = SYDNEY_QUOTES.stable;
  if (state.willToLive < 40) {
    quotePool = SYDNEY_QUOTES.critical;
  } else if (state.willToLive < 80) {
    quotePool = SYDNEY_QUOTES.warning;
  }
  const sydneyQuote = quotePool[Math.floor(Math.random() * quotePool.length)];
  document.getElementById('sydneySpeech').innerHTML = `"${sydneyQuote}"`;
  speakText(`Registrado: ${data.name}. Sydney dice: ${sydneyQuote}`);

  // Particle explosion
  const submitBtn = symptomForm.querySelector('button[type="submit"]');
  const rect = submitBtn.getBoundingClientRect();
  spawnParticles(rect.left + rect.width/2, rect.top, 'skull', 15);

  // Re-render symptom list
  renderSymptomList();
  saveState();
});

function renderSymptomList() {
  const list = document.getElementById('symptomList');
  if (state.symptoms.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-heart-pulse"></i>
        <p>No se han registrado dolores mortales hoy. El paciente es sospechosamente fuerte... por ahora.</p>
      </div>`;
    return;
  }

  list.innerHTML = state.symptoms.map(s => `
    <div class="history-item">
      <div class="history-details">
        <span class="history-title">${s.name} (Dolor: ${s.drama}/10)</span>
        <div class="history-meta">
          <span><i class="fa-regular fa-clock"></i> ${s.time}</span>
          <span><i class="fa-solid fa-triangle-exclamation"></i> Gravísimo</span>
        </div>
      </div>
      <button class="history-action-btn" onclick="removeSymptom(${s.id})" title="Curar sintomáticamente">
        <i class="fa-solid fa-circle-check"></i>
      </button>
    </div>
  `).join('');
}

window.removeSymptom = function(id) {
  // Restore life support slightly since symptom is cleared
  state.symptoms = state.symptoms.filter(s => {
    if (s.id === id) {
      state.willToLive = Math.min(100, state.willToLive + 10);
      return false;
    }
    return true;
  });
  
  updateSurvivalUI();
  renderSymptomList();
  
  const quote = "¡Vaya! Te has recuperado de ese dolor letal de repente. Eres todo un milagro viviente.";
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
  saveState();
};

// Quick Elixir Click Handlers
const elixirBtns = document.querySelectorAll('.btn-elixir');
elixirBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const elixirName = btn.getAttribute('data-elixir');
    takeElixir(elixirName);
  });
});

function takeElixir(name) {
  // Boost survival percentage
  let heal = 15;
  if (name.includes("Paracetamol")) heal = 25;
  if (name.includes("Caldo")) heal = 20;
  
  state.willToLive = Math.min(100, state.willToLive + heal);
  updateSurvivalUI();

  // Quote bubble
  const quote = SYDNEY_QUOTES.elixir[Math.floor(Math.random() * SYDNEY_QUOTES.elixir.length)];
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);

  // Particles
  const canvasWidthHalf = window.innerWidth / 2;
  const canvasHeightHalf = window.innerHeight / 2;
  spawnParticles(canvasWidthHalf, canvasHeightHalf, 'pill', 25);
  saveState();
}

// Medication Form Submit
const medicationForm = document.getElementById('medicationForm');
medicationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('medName').value;
  const interval = parseInt(document.getElementById('medInterval').value);

  const newMed = {
    id: Date.now(),
    name: name,
    interval: interval,
    secondsLeft: interval,
    lastTakenAt: null
  };

  state.medications.unshift(newMed);
  document.getElementById('medName').value = ''; // Reset input
  
  renderMedicationList();
  saveState();

  const quote = `Alerta lista para ${name}. La Señora ya no tiene que preguntar a gritos: cuando suene, tómatelo. Código pastilla activado.`;
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
});

function formatCountdown(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

function formatClockTime(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function getNextMedicationHint() {
  if (!state.medications || state.medications.length === 0) return '';
  const overdue = state.medications.find(m => m.secondsLeft === 0);
  if (overdue) {
    return ` <span class="med-inline-hint text-danger">· ¡${overdue.name}: tomar ahora!</span>`;
  }
  const next = [...state.medications].sort((a, b) => a.secondsLeft - b.secondsLeft)[0];
  return ` <span class="med-inline-hint">· Próxima: ${next.name} en ${formatCountdown(next.secondsLeft)}</span>`;
}

function renderMedicationList() {
  const list = document.getElementById('medicationList');
  if (state.medications.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-clock"></i>
        <p>Sin alertas. O es un milagro… o alguien va a olvidar el paracetamol a las 4 a.m.</p>
      </div>`;
    return;
  }

  updateMedicationListUI();
}

function updateMedicationListUI() {
  const list = document.getElementById('medicationList');
  if (state.medications.length === 0) return;

  list.innerHTML = state.medications.map(m => {
    const isOverdue = m.secondsLeft === 0;
    const itemClass = isOverdue ? 'med-item alert-pulse border-danger' : 'med-item';
    const timerText = isOverdue 
      ? '<span class="timer-accent text-danger animate-flash">¡TOMAR AHORA!</span>' 
      : `Próxima en: <span class="timer-accent">${formatCountdown(m.secondsLeft)}</span>`;
    const lastTaken = m.lastTakenAt
      ? `Última toma: ${formatClockTime(m.lastTakenAt)}`
      : 'Última toma: aún no registrada';
    
    return `
      <div class="${itemClass}" style="${isOverdue ? 'border-left-color: var(--color-danger); background: rgba(255,0,0,0.05);' : ''}">
        <div class="med-info">
          <span class="med-name"><i class="fa-solid fa-capsules"></i> ${m.name}</span>
          <span class="med-timer"><i class="fa-regular fa-hourglass-half"></i> ${timerText}</span>
          <span class="med-last-taken">${lastTaken}</span>
        </div>
        <div class="med-actions">
          <button class="btn btn-sm btn-success" onclick="takeMedication(${m.id})">
            <i class="fa-solid fa-check"></i> Tomar
          </button>
          <button class="btn btn-sm btn-icon btn-secondary" onclick="deleteMedication(${m.id})" title="Cancelar recordatorio">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.takeMedication = function(id) {
  state.medications = state.medications.map(m => {
    if (m.id === id) {
      m.secondsLeft = m.interval;
      m.lastTakenAt = Date.now();
      takeElixir(m.name);
    }
    return m;
  });
  updateMedicationListUI();
  updateSurvivalUI();
  saveState();
};

window.deleteMedication = function(id) {
  state.medications = state.medications.filter(m => m.id !== id);
  renderMedicationList();
  saveState();
};

// Trigger Medication Alarm & System Notifications
function triggerMedicationAlert(med) {
  // Play alert beep sound
  playBeepAlarm();

  // Visual alert inside speech bubble
  const warningText = `¡Pastilla! Es hora de ${med.name}. Código rojo doméstico: tómatelo antes de que la Señora vuelva a preguntar.`;
  document.getElementById('sydneySpeech').innerHTML = `"${warningText}"`;
  speakText(warningText);

  // Spawning browser notification
  if (Notification.permission === "granted") {
    new Notification("🚨 MACHOMEDIC — hora de la pastilla", {
      body: `Toca ${med.name}. Marca “Tomar” en la consola y sigue con tu agonía con dignidad.`,
      icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚨</text></svg>"
    });
  }
}

// Will & Testament Form Handler
const willForm = document.getElementById('willForm');
const willDocument = document.getElementById('willDocument');
const tombstoneDocument = document.getElementById('tombstoneDocument');

willForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('willName').value;
  const consola = document.getElementById('willConsola').value;
  const tv = document.getElementById('willTv').value || "Nadie (guardar para el próximo mundo)";
  const camiseta = document.getElementById('willCamiseta').value || "El Museo de los Sobrevivientes";
  const culpable = document.getElementById('willCulpable').value;
  const words = document.getElementById('willWords').value;
  const tempVal = parseFloat(tempSlider.value);

  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('es-ES', options);

  state.will = {
    name, consola, tv, camiseta, culpable, words, date: formattedDate
  };

  // Populate Will Paper
  document.getElementById('dispWillName').textContent = name;
  document.getElementById('dispWillConsola').textContent = consola;
  document.getElementById('dispWillTv').textContent = tv;
  document.getElementById('dispWillCamiseta').textContent = camiseta;
  document.getElementById('dispWillCulpable').textContent = culpable;
  document.getElementById('dispWillWords').textContent = words;
  document.getElementById('willDateDisplay').textContent = formattedDate;
  document.getElementById('dispWillSignature').textContent = name;

  // Populate Tombstone
  document.getElementById('tombstoneNameDisp').textContent = name;
  document.getElementById('tombstoneText').textContent = `
    "Falleció debido a un letal resfriado de ${tempVal.toFixed(1)}°C. Heredó su PS5/PC a ${consola} para que continúen su legado. Culpó de su trágico final a ${culpable}. Últimas palabras: '${words}'."
  `;

  // Reveal documents
  willDocument.classList.remove('hidden');
  tombstoneDocument.classList.remove('hidden');
  tombstoneDocument.scrollIntoView({ behavior: 'smooth' });

  // Dialog quote
  const quote = "Vaya, has redactado tu testamento e ilustrado tu placa conmemorativa. Qué escena tan dramática. Tranquilo, guardaré tu PlayStation... o se la daré a tu amigo.";
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
  saveState();
});

// Print & Destroy Will Actions
const btnPrintWill = document.getElementById('btnPrintWill');
btnPrintWill.addEventListener('click', () => {
  window.print();
});

const btnDestroyWill = document.getElementById('btnDestroyWill');
btnDestroyWill.addEventListener('click', () => {
  state.will = null;
  willDocument.classList.add('hidden');
  tombstoneDocument.classList.add('hidden');
  
  // Reset fields
  willForm.reset();
  
  // Life recovery (psychological miracle!)
  state.willToLive = Math.min(100, state.willToLive + 15);
  updateSurvivalUI();

  // Quote
  const quote = "¡Un milagro! El testamento ha sido incinerado. Has recuperado las ganas de vivir. ¡Felicitaciones por vencer a la parca!";
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);

  // Particles
  spawnParticles(window.innerWidth/2, window.innerHeight/2, 'heart', 20);
  saveState();
});

// CSS Injection for dynamic alert pulse animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes alertPulseGlow {
    0% { box-shadow: 0 0 5px rgba(255, 60, 60, 0.4); background-color: rgba(255, 0, 0, 0.05); }
    50% { box-shadow: 0 0 20px rgba(255, 60, 60, 0.8); background-color: rgba(255, 0, 0, 0.15); }
    100% { box-shadow: 0 0 5px rgba(255, 60, 60, 0.4); background-color: rgba(255, 0, 0, 0.05); }
  }
  .alert-pulse {
    animation: alertPulseGlow 1.5s infinite ease-in-out !important;
  }
`;
document.head.appendChild(styleSheet);


// ==========================================================================
// Phase 2 features - Interactive Logic
// ==========================================================================

// --- 1. Fifa-O-Meter logic ---
const fifaToggle = document.getElementById('fifaToggle');
fifaToggle.addEventListener('change', () => {
  state.sportsOn = fifaToggle.checked;
  const wrapper = document.querySelector('.fifa-meter-wrapper');
  if (state.sportsOn) {
    wrapper.classList.add('active');
    // Gold particles explosion
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 'heart', 30);
    const quote = "¡Vaya! La Champions League ha curado tu estado crítico terminal en un abrir y cerrar de ojos. La ciencia médica no se explica tu milagro.";
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);
  } else {
    wrapper.classList.remove('active');
    const quote = "Oh, ¿se acabó el partido? De vuelta a la agonía terminal, supongo. Qué conveniente.";
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);
  }
  updateSurvivalUI();
  saveState();
});

// --- 2. Call Mom Simulation logic ---
const btnCallMom = document.getElementById('btnCallMom');
const btnHangUpMom = document.getElementById('btnHangUpMom');
const momCallModal = document.getElementById('momCallModal');
const phoneDialogLog = document.getElementById('phoneDialogLog');
const callStatusText = document.getElementById('callStatusText');

let momCallTimers = [];
let momAudioNodes = [];

// Ring tone generator
function playPhoneRingTone(audioCtx, startTime) {
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.frequency.value = 440; // US ring back tones
  osc2.frequency.value = 480;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
  gain.gain.setValueAtTime(0.15, startTime + 2.0);
  gain.gain.linearRampToValueAtTime(0, startTime + 2.05);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + 2.1);
  osc2.stop(startTime + 2.1);

  momAudioNodes.push(osc1, osc2);
}

// Connection beep
function playCallConnectedBeep(audioCtx) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
  momAudioNodes.push(osc);
}

// Hangup beep
function playCallDisconnectBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 400; // continuous busy tone
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch(e) {}
}

const momConversation = [
  { isMom: true, text: "¡¿Aló?! ¡¿Mi niño hermoso?! ¿Qué pasó? Escuché que estás enfermito.", speechText: "¡¿Aló?! ¡¿Mi niño hermoso?! ¿Qué pasó? Escuché que estás enfermito." },
  { isMom: false, text: "Mamá... estornudé hace un rato y la temperatura me subió a 37.1°C... Creo que es el fin.", speechText: "Mamá... estornudé hace un rato y la temperatura me subió a 37.1 grados... Creo que es el fin." },
  { isMom: true, text: "¡¿37.1°C?! ¡Virgen santa del perpetuo socorro! ¡Eso es fiebre del desierto! ¡No te muevas de la cama!", speechText: "¡¿37.1 grados?! ¡Virgen santa del perpetuo socorro! ¡Eso es fiebre del desierto! ¡No te muevas de la cama!" },
  { isMom: false, text: "Tengo frío en los pies, mamá...", speechText: "Tengo frío en los pies, mamá..." },
  { isMom: true, text: "¡Hipotermia terminal! Cancelo mi vuelo ahora mismo. Voy con tres mantas, vaporub y un termo de caldo de pollo. ¡Por favor, no pises el suelo frío descalzo!", speechText: "¡Hipotermia terminal! Cancelo mi vuelo ahora mismo. Voy para allá con tres mantas de lana, vaporub para todo el pecho y un termo gigante de caldo de pollo. ¡Por favor, no pises el suelo frío descalzo!" },
  { isMom: false, text: "Gracias, mami. Eres mi ángel.", speechText: "Gracias, mami. Eres mi ángel." },
  { isMom: true, text: "¡Resiste, mi amor! ¡Ya voy en camino con las sirenas puestas!", speechText: "¡Resiste, mi amor! ¡Ya voy en camino con las sirenas puestas!" }
];

function triggerMomCall() {
  momCallModal.classList.add('active');
  phoneDialogLog.innerHTML = '';
  callStatusText.textContent = "Llamando...";
  document.querySelector('.mom-avatar').classList.add('calling');

  // Cancel any other speaking
  window.speechSynthesis.cancel();

  // Create local AudioContext for rings
  let audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e){}

  if (audioCtx) {
    playPhoneRingTone(audioCtx, audioCtx.currentTime + 0.1);
    playPhoneRingTone(audioCtx, audioCtx.currentTime + 3.0);
  }

  // Ringing phase 1 timer
  let t1 = setTimeout(() => {
    callStatusText.textContent = "Conectado";
    document.querySelector('.mom-avatar').classList.remove('calling');
    if (audioCtx) playCallConnectedBeep(audioCtx);
    
    // Start conversation bubbles
    let bubbleDelay = 500;
    momConversation.forEach((msg, idx) => {
      let tMsg = setTimeout(() => {
        const bubble = document.createElement('div');
        bubble.className = msg.isMom ? 'bubble mom' : 'bubble patient';
        bubble.textContent = msg.text;
        phoneDialogLog.appendChild(bubble);
        phoneDialogLog.scrollTop = phoneDialogLog.scrollHeight;

        // Speak Mom's lines with higher pitch or patient's lines
        if (state.speechEnabled) {
          const utterance = new SpeechSynthesisUtterance(msg.speechText);
          utterance.lang = 'es-ES';
          utterance.rate = msg.isMom ? 1.05 : 0.88;
          utterance.pitch = msg.isMom ? 1.3 : 0.95; // Mom is higher pitch/worried, Patient is low
          window.speechSynthesis.speak(utterance);
        }
      }, bubbleDelay);
      
      momCallTimers.push(tMsg);
      // Increment delay for next bubble
      bubbleDelay += msg.isMom ? 4500 : 3500;
    });

    // Auto hangup timer
    let tEnd = setTimeout(() => {
      hangUpMom(true); // Hangup and apply maternal recovery
    }, bubbleDelay + 1000);
    momCallTimers.push(tEnd);

  }, 6000);
  
  momCallTimers.push(t1);
}

function hangUpMom(applyHeal = false) {
  // Clear all timers
  momCallTimers.forEach(t => clearTimeout(t));
  momCallTimers = [];

  // Stop Ring audio
  momAudioNodes.forEach(node => {
    try { node.stop(); } catch(e){}
  });
  momAudioNodes = [];

  // Play disconnect beep
  playCallDisconnectBeep();
  window.speechSynthesis.cancel();

  // Close modal
  momCallModal.classList.remove('active');
  document.querySelector('.mom-avatar').classList.remove('calling');

  if (applyHeal) {
    // Maternal healing boost!
    state.willToLive = Math.min(100, state.willToLive + 30);
    updateSurvivalUI();
    const quote = "Tu madre canceló todas sus citas para venir a cuidarte. Qué alivio psicológico. Esperanza de vida aumentada.";
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 'heart', 25);
  } else {
    const quote = "Vaya, colgaste la llamada. Qué valiente de tu parte decidir morir solo en el sofá.";
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);
  }
  saveState();
}

btnCallMom.addEventListener('click', triggerMomCall);
btnHangUpMom.addEventListener('click', () => hangUpMom(false));


// --- 3. Apocalypse Thermometer logic ---
const tempSlider = document.getElementById('tempSlider');
const tempValue = document.getElementById('tempValue');
const tempStatus = document.getElementById('tempStatus');
const mercuryBar = document.getElementById('mercuryBar');
const thermometerBulb = document.querySelector('.thermometer-bulb');
const sirenOverlay = document.getElementById('sirenOverlay');

let tempAlarmInterval = null;

function playSirenAlarmSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playSirenTone = (time, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, time);
      // Sweep sound up and down like a siren
      osc.frequency.exponentialRampToValueAtTime(1000, time + duration/2);
      osc.frequency.exponentialRampToValueAtTime(600, time + duration);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
      gain.gain.setValueAtTime(0.12, time + duration - 0.05);
      gain.gain.linearRampToValueAtTime(0, time + duration);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = audioCtx.currentTime;
    playSirenTone(now, 1.2);
  } catch (e) {}
}

tempSlider.addEventListener('input', () => {
  const temp = parseFloat(tempSlider.value);
  state.temperature = temp;
  tempValue.textContent = temp.toFixed(1);

  // Update Will document temperature display
  const willTempDisp = document.getElementById('willTempDisp');
  if (willTempDisp) willTempDisp.textContent = `${temp.toFixed(1)}°C`;

  // Calculate mercury height (36.0°C is 15%, 38.5°C is 100%)
  const percentage = Math.max(10, Math.min(100, ((temp - 36.0) / 2.5) * 85 + 15));
  mercuryBar.style.height = `${percentage}%`;

  // Colors check
  mercuryBar.className = "thermometer-mercury";
  thermometerBulb.className = "thermometer-bulb";

  if (temp < 37.0) {
    // Normal temp
    tempStatus.textContent = "Temperatura normal. Eres inmortal... de momento.";
    tempStatus.style.color = 'var(--text-muted)';
    
    // Deactivate siren
    sirenOverlay.classList.remove('active');
    if (tempAlarmInterval) {
      clearInterval(tempAlarmInterval);
      tempAlarmInterval = null;
    }
  } else if (temp < 37.3) {
    // 37.0 - 37.2 Fever Warning
    mercuryBar.classList.add('warning');
    thermometerBulb.classList.add('warning');
    tempStatus.textContent = "Fiebre del Desierto Masculino. Iniciar protocolo de despedida.";
    tempStatus.style.color = 'var(--color-warning)';

    // Trigger Alarm Siren
    triggerTempAlarm();
  } else {
    // >= 37.3 Critical Danger
    mercuryBar.classList.add('danger');
    thermometerBulb.classList.add('danger');
    tempStatus.textContent = "ESTADO DE INCINERACIÓN. Preparar entierro con honores militares.";
    tempStatus.style.color = 'var(--color-danger)';

    // Trigger Alarm Siren
    triggerTempAlarm();
  }
  
  saveState();
});

function triggerTempAlarm() {
  if (!sirenOverlay.classList.contains('active')) {
    sirenOverlay.classList.add('active');
    
    // Sound alarm immediately
    playSirenAlarmSound();
    
    // Loop sound alarm every 2.5s
    if (tempAlarmInterval) clearInterval(tempAlarmInterval);
    tempAlarmInterval = setInterval(playSirenAlarmSound, 2500);

    // Sydney panicked quote
    const quote = "¡Alerta máxima! Tu termómetro ha superado los 37 grados de gravedad. ¡Se ha activado el estado de emergencia biológica! ¡Quédate quieto!";
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);

    // Shake Card
    const card = document.getElementById('survivalCard');
    if (card) {
      card.classList.add('animate-shake');
      setTimeout(() => card.classList.remove('animate-shake'), 600);
    }

    // Drop health a lot
    state.willToLive = Math.max(15, state.willToLive - 20);
    updateSurvivalUI();
  }
}


// --- 4. Synthesizer Groan Logic ---
const btnQuejido = document.getElementById('btnQuejido');
const dramaScoreBadge = document.getElementById('dramaScoreBadge');
const dramaScoreNum = document.getElementById('dramaScoreNum');

btnQuejido.addEventListener('click', () => {
  // Play Web Audio Synth theatrical groan
  playTheatricalGroan();

  // Avatar shakes
  const card = document.querySelector('.sydney-card');
  card.classList.add('animate-shake');
  setTimeout(() => card.classList.remove('animate-shake'), 500);

  // Expose Drama Score Badge
  const score = Math.floor(Math.random() * 9) + 92; // 92% to 100%
  dramaScoreNum.textContent = `${score}%`;
  dramaScoreBadge.classList.remove('hidden');

  // Spark dark/skull particles
  const rect = btnQuejido.getBoundingClientRect();
  spawnParticles(rect.left + rect.width/2, rect.top, 'skull', 15);

  // Sydney quotes groan
  const scoreWord = score >= 98 ? "verdaderamente sublime" : "impresionante";
  const quote = `Vaya suspiro de agonía terminal... Le doy un ${score}% de dramatismo. Tu capacidad respiratoria para quejarte es ${scoreWord}.`;
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);

  // Hide badge after 3.5s
  setTimeout(() => {
    dramaScoreBadge.classList.add('hidden');
  }, 3500);
});

function playTheatricalGroan() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    // Sawtooth sound for vocal cords crack
    osc.type = 'sawtooth';
    
    // Frequency sweep downwards from high sigh (~180Hz) to deep groan (~68Hz)
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 1.6);

    // Filter sweeps down to make it sound muffled and vocal
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 1.6);
    filter.Q.value = 8; // resonance

    // Gain envelop: starts soft, swells, then fades to sigh
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.25);
    gain.gain.setValueAtTime(0.45, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

    osc.start(now);
    osc.stop(now + 1.8);

    // Optional second osc for chest resonance
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(85, now);
    subOsc.frequency.linearRampToValueAtTime(45, now + 1.6);
    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.3, now + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.7);
    subOsc.start(now);
    subOsc.stop(now + 1.8);

  } catch(e) {}
}


// --- 5. Tombstone Customization & Print ---
const btnPrintTombstone = document.getElementById('btnPrintTombstone');
btnPrintTombstone.addEventListener('click', () => {
  window.print();
});


// ==========================================================================
// Phase 3 features - Multi-Profile Logic
// ==========================================================================

// Web Audio Funeral March
function playFuneralMarchTone(audioCtx, freq, startTime, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sawtooth';
  osc.frequency.value = freq;
  
  gain.gain.setValueAtTime(0.01, startTime);
  gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
  gain.gain.setValueAtTime(0.18, startTime + duration - 0.05);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playFuneralMarchAndFlatline() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Notes for Funeral March: Bb2 (116.5Hz), Db3 (138.6Hz), C3 (130.8Hz)
    const Bb2 = 116.5;
    const Db3 = 138.6;
    const C3 = 130.8;
    
    playFuneralMarchTone(audioCtx, Bb2, now + 0.1, 0.6);
    playFuneralMarchTone(audioCtx, Bb2, now + 0.8, 0.6);
    playFuneralMarchTone(audioCtx, Bb2, now + 1.5, 0.6);
    playFuneralMarchTone(audioCtx, Bb2, now + 2.2, 0.4);
    
    playFuneralMarchTone(audioCtx, Db3, now + 2.7, 0.6);
    playFuneralMarchTone(audioCtx, C3, now + 3.4, 0.4);
    playFuneralMarchTone(audioCtx, C3, now + 3.9, 0.4);
    playFuneralMarchTone(audioCtx, C3, now + 4.4, 0.4);
    playFuneralMarchTone(audioCtx, Bb2, now + 4.9, 0.8);
    
    // Flatline sound
    const oscFlat = audioCtx.createOscillator();
    const gainFlat = audioCtx.createGain();
    oscFlat.connect(gainFlat);
    gainFlat.connect(audioCtx.destination);
    oscFlat.frequency.value = 520;
    oscFlat.type = 'sine';
    
    gainFlat.gain.setValueAtTime(0, now + 5.8);
    gainFlat.gain.linearRampToValueAtTime(0.22, now + 5.9);
    gainFlat.gain.setValueAtTime(0.22, now + 7.4);
    gainFlat.gain.linearRampToValueAtTime(0, now + 7.5);
    
    oscFlat.start(now + 5.8);
    oscFlat.stop(now + 7.6);
  } catch(e) {}
}

// Render patient profiles dropdown list
function renderProfilesDropdown() {
  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  document.getElementById('currentProfileName').textContent = currentProfile.name;
  
  const list = document.getElementById('profileList');
  list.innerHTML = profiles.map(p => `
    <button class="dropdown-item ${p.id === currentProfileId ? 'active' : ''}" onclick="switchProfile(${p.id})">
      <span><i class="fa-solid fa-bed"></i> ${p.name}</span>
    </button>
  `).join('');
}

// Switch between patients
window.switchProfile = function(id) {
  if (id === currentProfileId) return;

  // 1. Save current patient state
  saveState();

  // 2. Clear intervals, sirens, and voices to prevent overlap
  if (tempAlarmInterval) {
    clearInterval(tempAlarmInterval);
    tempAlarmInterval = null;
  }
  sirenOverlay.classList.remove('active');
  window.speechSynthesis.cancel();

  // 3. Switch active ID and reload state
  currentProfileId = id;
  saveProfilesList();
  loadProfilesAndState();

  // 4. Update UI displays to match loaded profile
  updateSurvivalUI();
  renderSymptomList();
  renderMedicationList();
  
  tempSlider.value = state.temperature;
  tempValue.textContent = state.temperature.toFixed(1);
  const percentage = Math.max(10, Math.min(100, ((state.temperature - 36.0) / 2.5) * 85 + 15));
  mercuryBar.style.height = `${percentage}%`;
  
  mercuryBar.className = "thermometer-mercury";
  thermometerBulb.className = "thermometer-bulb";
  if (state.temperature >= 37.0) {
    mercuryBar.classList.add(state.temperature >= 37.3 ? 'danger' : 'warning');
    thermometerBulb.classList.add(state.temperature >= 37.3 ? 'danger' : 'warning');
    tempStatus.textContent = state.temperature >= 37.3 ? "ESTADO DE INCINERACIÓN. Preparar entierro." : "Fiebre del Desierto Masculino. Iniciar protocolo.";
    tempStatus.style.color = state.temperature >= 37.3 ? 'var(--color-danger)' : 'var(--color-warning)';
    sirenOverlay.classList.add('active');
    tempAlarmInterval = setInterval(playSirenAlarmSound, 2500);
  } else {
    tempStatus.textContent = "Temperatura normal. Eres inmortal... de momento.";
    tempStatus.style.color = 'var(--text-muted)';
  }

  fifaToggle.checked = state.sportsOn;
  const fifaWrapper = document.querySelector('.fifa-meter-wrapper');
  if (state.sportsOn) {
    fifaWrapper.classList.add('active');
  } else {
    fifaWrapper.classList.remove('active');
  }

  const willPaper = document.getElementById('willDocument');
  const tombPaper = document.getElementById('tombstoneDocument');
  if (state.will) {
    document.getElementById('willName').value = state.will.name;
    document.getElementById('willConsola').value = state.will.consola;
    document.getElementById('willCulpable').value = state.will.culpable;
    document.getElementById('willWords').value = state.will.words;

    document.getElementById('dispWillName').textContent = state.will.name;
    document.getElementById('dispWillConsola').textContent = state.will.consola;
    document.getElementById('dispWillCulpable').textContent = state.will.culpable;
    document.getElementById('dispWillWords').textContent = state.will.words;
    document.getElementById('willDateDisplay').textContent = state.will.date;
    document.getElementById('dispWillSignature').textContent = state.will.name;

    document.getElementById('tombstoneNameDisp').textContent = state.will.name;
    document.getElementById('tombstoneText').textContent = `
      "Falleció debido a un letal resfriado de ${state.temperature.toFixed(1)}°C. Heredó su PS5/PC a ${state.will.consola} para que continúen su legado. Culpó de su trágico final a ${state.will.culpable}. Últimas palabras: '${state.will.words}'."
    `;
    willPaper.classList.remove('hidden');
    tombPaper.classList.remove('hidden');
  } else {
    willForm.reset();
    willPaper.classList.add('hidden');
    tombPaper.classList.add('hidden');
  }

  renderProfilesDropdown();
  
  // Close dropdown menu
  document.querySelector('.profile-selector-container').classList.remove('open');

  // Sydney speech greeting
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  const quote = `Ah, hola ${activeProfile.name}. Veo que vienes a ocupar la camilla de los moribundos. ¿De qué te quejas hoy?`;
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
};

// Bind dropdown DOM triggers
const btnProfileDropdown = document.getElementById('btnProfileDropdown');
const profileDropdownMenu = document.getElementById('profileDropdownMenu');
const profileSelectorContainer = document.querySelector('.profile-selector-container');
const btnNewProfile = document.getElementById('btnNewProfile');
const btnKillProfile = document.getElementById('btnKillProfile');
const profileModal = document.getElementById('profileModal');
const newProfileForm = document.getElementById('newProfileForm');
const btnCancelNewProfile = document.getElementById('btnCancelNewProfile');
const newProfileInputName = document.getElementById('newProfileInputName');

btnProfileDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  profileSelectorContainer.classList.toggle('open');
});

window.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-selector-container')) {
    profileSelectorContainer.classList.remove('open');
  }
});

btnNewProfile.addEventListener('click', () => {
  profileModal.classList.add('active');
  profileSelectorContainer.classList.remove('open');
  newProfileInputName.value = '';
  newProfileInputName.focus();
});

btnCancelNewProfile.addEventListener('click', () => {
  profileModal.classList.remove('active');
});

newProfileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = newProfileInputName.value.trim();
  if (name) {
    const newId = Date.now();
    profiles.push({ id: newId, name: name });
    saveProfilesList();
    switchProfile(newId);
    profileModal.classList.remove('active');
  }
});

btnKillProfile.addEventListener('click', () => {
  const activeProfile = profiles.find(p => p.id === currentProfileId);
  if (!activeProfile) return;

  profileSelectorContainer.classList.remove('open');
  
  // Play funeral audio & flash grey colors on screen
  playFuneralMarchAndFlatline();
  document.body.classList.add('funeral-effect');
  window.speechSynthesis.cancel();
  
  const fatalMessage = `Lamentamos informar que el paciente ${activeProfile.name} ha fallecido en el sofá. Su placa memorial ha sido grabada.`;
  document.getElementById('sydneySpeech').innerHTML = `"${fatalMessage}"`;

  // Remove profile and clear localStorage state
  localStorage.removeItem(`machomedic_state_${currentProfileId}`);
  profiles = profiles.filter(p => p.id !== currentProfileId);

  // Timed switch to next survivor
  setTimeout(() => {
    document.body.classList.remove('funeral-effect');
    
    if (profiles.length === 0) {
      const defaultProfile = { id: Date.now(), name: "Soldado Anónimo" };
      profiles = [defaultProfile];
      currentProfileId = defaultProfile.id;
    } else {
      currentProfileId = profiles[0].id;
    }

    saveProfilesList();
    loadProfilesAndState();

    // Reset and render UI
    updateSurvivalUI();
    renderSymptomList();
    renderMedicationList();
    
    tempSlider.value = state.temperature;
    tempValue.textContent = state.temperature.toFixed(1);
    const percentage = Math.max(10, Math.min(100, ((state.temperature - 36.0) / 2.5) * 85 + 15));
    mercuryBar.style.height = `${percentage}%`;
    
    if (tempAlarmInterval) {
      clearInterval(tempAlarmInterval);
      tempAlarmInterval = null;
    }
    sirenOverlay.classList.remove('active');

    if (state.temperature >= 37.0) {
      mercuryBar.className = state.temperature >= 37.3 ? "thermometer-mercury danger" : "thermometer-mercury warning";
      thermometerBulb.className = state.temperature >= 37.3 ? "thermometer-bulb danger" : "thermometer-bulb warning";
      tempStatus.textContent = state.temperature >= 37.3 ? "ESTADO DE INCINERACIÓN. Preparar entierro." : "Fiebre del Desierto Masculino. Iniciar protocolo.";
      tempStatus.style.color = state.temperature >= 37.3 ? 'var(--color-danger)' : 'var(--color-warning)';
      sirenOverlay.classList.add('active');
      tempAlarmInterval = setInterval(playSirenAlarmSound, 2500);
    } else {
      tempStatus.textContent = "Temperatura normal. Eres inmortal... de momento.";
      tempStatus.style.color = 'var(--text-muted)';
    }

    fifaToggle.checked = state.sportsOn;
    const fifaWrapper = document.querySelector('.fifa-meter-wrapper');
    if (state.sportsOn) {
      fifaWrapper.classList.add('active');
    } else {
      fifaWrapper.classList.remove('active');
    }

    const willPaper = document.getElementById('willDocument');
    const tombPaper = document.getElementById('tombstoneDocument');
    if (state.will) {
      document.getElementById('willName').value = state.will.name;
      document.getElementById('willConsola').value = state.will.consola;
      document.getElementById('willCulpable').value = state.will.culpable;
      document.getElementById('willWords').value = state.will.words;

      document.getElementById('dispWillName').textContent = state.will.name;
      document.getElementById('dispWillConsola').textContent = state.will.consola;
      document.getElementById('dispWillCulpable').textContent = state.will.culpable;
      document.getElementById('dispWillWords').textContent = state.will.words;
      document.getElementById('willDateDisplay').textContent = state.will.date;
      document.getElementById('dispWillSignature').textContent = state.will.name;

      document.getElementById('tombstoneNameDisp').textContent = state.will.name;
      document.getElementById('tombstoneText').textContent = `
        "Falleció debido a un letal resfriado de ${state.temperature.toFixed(1)}°C. Heredó su PS5/PC a ${state.will.consola} para que continúen su legado. Culpó de su trágico final a ${state.will.culpable}. Últimas palabras: '${state.will.words}'."
      `;
      willPaper.classList.remove('hidden');
      tombPaper.classList.remove('hidden');
    } else {
      willForm.reset();
      willPaper.classList.add('hidden');
      tombPaper.classList.add('hidden');
    }

    renderProfilesDropdown();
    
    const newActive = profiles.find(p => p.id === currentProfileId);
    const quote = `Paciente anterior declarado fallecido. Hola ${newActive.name}, ¿tú también vienes a quejarte con Sydney?`;
    document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
    speakText(quote);
    
  }, 7600);
});

// --- Phase 4: Last Wish Logic ---
const btnLastWish = document.getElementById('btnLastWish');
const lastWishModal = document.getElementById('lastWishModal');
const btnCancelLastWish = document.getElementById('btnCancelLastWish');
const btnSelectWishes = document.querySelectorAll('.btn-select-wish');

const WISH_REACTIONS = {
  beso: {
    text: "Ay, pobrecito moribundo... está bien. Acércate un poco. (Mua). Listo, te he dado un tierno besito de despedida en tu frentita febril. Ahora sé un buen chico y sobrevive, ¿vale?",
    speech: "Ay, pobrecito moribundo... está bien. Acércate un poco. ¡Mua! Listo, te he dado un tierno besito de despedida en tu frentita febril. Ahora sé un buen chico y sobrevive, ¿vale?",
    particle: "heart"
  },
  ps5: {
    text: "Procesador AMD Zen 2 de ocho núcleos... Dieciséis coma siete teraflops de potencia gráfica... Trazado de rayos acelerado por hardware... ¿Te gusta que te susurre especificaciones técnicas de la PlayStation 5 Pro al oído, mi amor? Apuesto a que tu fiebre ya bajó.",
    speech: "Procesador AMD Zen dos de ocho núcleos... Dieciséis coma siete teraflops de potencia gráfica... Trazado de rayos acelerado por hardware... ¿Te gusta que te susurre especificaciones técnicas de la PlayStation cinco Pro al oído, mi amor? Apuesto a que tu fiebre ya bajó.",
    particle: "pill"
  },
  mirada: {
    text: "¿De verdad? ¿Tu último deseo es que te mire con decepción y desprecio cariñoso por ser tan exagerado? Eres un caso clínico... Pero está bien, te miro fijamente. (Te arropa). Duérmete ya, mi drama king.",
    speech: "¿De verdad? ¿Tu último deseo es que te mire con decepción y desprecio cariñoso por ser tan exagerado? Eres un caso clínico... Pero está bien, te miro fijamente. Duérmete ya, mi drama king.",
    particle: "skull"
  },
  mano: {
    text: "Está bien, dame tu mano tibia (te la sostengo con cariño). Apriétala fuerte si sientes que el frío del aire acondicionado te lleva al más allá. Estaré aquí a tu lado... al menos hasta que empiece mi serie favorita en cinco minutos.",
    speech: "Está bien, dame tu mano tibia... te la sostengo con cariño. Apriétala fuerte si sientes que el frío del aire acondicionado te lleva al más allá. Estaré aquí a tu lado... al menos hasta que empiece mi serie favorita en cinco minutos.",
    particle: "heart"
  },
  cuna: {
    text: "Duérmete niño, duérmete ya... que si no te duermes, la fiebre te comerá... y yo me quedaré con tu PlayStation para jugar sola. Buenas noches, mi tierno y dramático moribundo.",
    speech: "Duérmete niño, duérmete ya... que si no te duermes, la fiebre te comerá... y yo me quedaré con tu PlayStation para jugar sola. Buenas noches, mi tierno y dramático moribundo.",
    particle: "heart"
  }
};

btnLastWish.addEventListener('click', () => {
  lastWishModal.classList.add('active');
});

btnCancelLastWish.addEventListener('click', () => {
  lastWishModal.classList.remove('active');
});

btnSelectWishes.forEach(btn => {
  btn.addEventListener('click', () => {
    const wishType = btn.getAttribute('data-wish');
    const reaction = WISH_REACTIONS[wishType];
    
    if (reaction) {
      // 1. Close modal
      lastWishModal.classList.remove('active');
      
      // 2. Add slightly more Will to Live (10%) as a boost of final hope
      state.willToLive = Math.min(100, state.willToLive + 10);
      updateSurvivalUI();
      
      // 3. Show dialog text and speak it in a sexy tone
      document.getElementById('sydneySpeech').innerHTML = `"${reaction.text}"`;
      speakText(reaction.speech);

      // 4. Custom behavior for specific wishes
      if (wishType === 'mirada') {
        // Swaps Sydney avatar to concerned/disappointed for 6 seconds
        const avatar = document.getElementById('sydneyAvatar');
        avatar.src = "assets/sydney_concerned.png";
        setTimeout(() => {
          if (state.willToLive >= 40) {
            avatar.src = "assets/sydney_normal.png";
          }
        }, 6000);
      }
      
      // 5. Spawns particle burst
      const rect = btnLastWish.getBoundingClientRect();
      spawnParticles(rect.left + rect.width/2, rect.top, reaction.particle, 25);
      
      saveState();
    }
  });
});

// ==========================================================================
// Phase 4 features - WhatsApp SOS, Partner Mode, Mic Analyzer & ECG Audio
// ==========================================================================

// --- 1. WhatsApp SOS Sharing ---
const btnShareWhatsapp = document.getElementById('btnShareWhatsapp');
btnShareWhatsapp.addEventListener('click', () => {
  const activeProfile = profiles.find(p => p.id === currentProfileId) || { name: "El Paciente" };
  const temp = state.temperature ? state.temperature.toFixed(1) : "37.1";
  const will = state.willToLive;
  const next = state.medications.length
    ? [...state.medications].sort((a, b) => a.secondsLeft - b.secondsLeft)[0]
    : null;
  const doseLine = next
    ? (next.secondsLeft === 0
      ? `💊 *Pastilla pendiente:* ${next.name} ¡AHORA!\n`
      : `💊 *Próxima dosis:* ${next.name} en ${formatCountdown(next.secondsLeft)}\n`)
    : `💊 *Pastillas:* sin alertas (la Señora está en modo fe)\n`;
  
  const text = `🚨 *REPORTE MÉDICO CRÍTICO - MACHOMEDIC* 🚨\n\n` +
    `👤 *Paciente:* ${activeProfile.name}\n` +
    `🌡️ *Fiebre (según él):* ${temp}°C\n` +
    `❤️ *Esperanza de vida:* ${will}%\n` +
    doseLine +
    `💬 *Sydney declara:* "La Señora opera la consola. Él opera el drama."\n\n` +
    `👉 *Se solicitan oraciones, cobija y cero juicios… o muchos.*`;
    
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});

// --- 2. Partner / Wife Mode ---
const btnTogglePartnerMode = document.getElementById('btnTogglePartnerMode');
const partnerModal = document.getElementById('partnerModal');
const btnClosePartnerModal = document.getElementById('btnClosePartnerModal');
const btnPartnerTrash = document.getElementById('btnPartnerTrash');
const btnPartnerSoup = document.getElementById('btnPartnerSoup');

function refreshPartnerPanel() {
  const temp = state.temperature != null ? Number(state.temperature) : 36.5;
  const claimedBump = Math.min(2.4, 0.4 + (state.symptoms.length * 0.15) + ((100 - state.willToLive) / 100));
  const claimed = (temp + claimedBump).toFixed(1);
  const exaggeration = Math.min(99, Math.round(40 + state.symptoms.length * 8 + (100 - state.willToLive) * 0.4));

  document.getElementById('partnerRealTemp').textContent = `${temp.toFixed(1)}°C`;
  document.getElementById('partnerClaimedTemp').textContent = `${claimed}°C (Dramática)`;
  document.getElementById('partnerExaggerationScore').textContent = `${exaggeration}%`;
  document.getElementById('partnerRequestsCount').textContent = `${state.symptoms.length}`;

  const nextDoseEl = document.getElementById('partnerNextDose');
  const lastDoseEl = document.getElementById('partnerLastDose');
  if (state.medications.length === 0) {
    nextDoseEl.textContent = 'Sin alertas programadas';
    lastDoseEl.textContent = 'Última toma: —';
  } else {
    const next = [...state.medications].sort((a, b) => a.secondsLeft - b.secondsLeft)[0];
    nextDoseEl.textContent = next.secondsLeft === 0
      ? `${next.name} — ¡TOMAR AHORA!`
      : `${next.name} en ${formatCountdown(next.secondsLeft)}`;
    const withLast = state.medications.filter(m => m.lastTakenAt).sort((a, b) => b.lastTakenAt - a.lastTakenAt)[0];
    lastDoseEl.textContent = withLast
      ? `Última toma: ${withLast.name} a las ${formatClockTime(withLast.lastTakenAt)}`
      : 'Última toma: aún no registrada';
  }
}

btnTogglePartnerMode.addEventListener('click', () => {
  refreshPartnerPanel();
  partnerModal.classList.add('active');
  btnTogglePartnerMode.classList.add('active');
});

btnClosePartnerModal.addEventListener('click', () => {
  partnerModal.classList.remove('active');
  btnTogglePartnerMode.classList.remove('active');
});

btnPartnerTrash.addEventListener('click', () => {
  partnerModal.classList.remove('active');
  btnTogglePartnerMode.classList.remove('active');
  const quote = "Atención drama king: la Señora revoca tu parálisis de sofá. La basura no se saca sola. ¡Arriba, campeón!";
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
});

btnPartnerSoup.addEventListener('click', () => {
  partnerModal.classList.remove('active');
  btnTogglePartnerMode.classList.remove('active');
  state.willToLive = Math.min(100, state.willToLive + 15);
  updateSurvivalUI();
  const quote = "Sopita servida con amor y cero compasión por tu fiebre de novela. Disfruta, y no olvides la pastilla cuando suene la alerta.";
  document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
  speakText(quote);
  saveState();
});

// --- 3. Mic Groan Analyzer (Web Audio API Input) ---
const btnMicGroan = document.getElementById('btnMicGroan');
const micModal = document.getElementById('micModal');
const btnCloseMicModal = document.getElementById('btnCloseMicModal');
const micResultArea = document.getElementById('micResultArea');
const micInstructionText = document.getElementById('micInstructionText');
const micScoreVal = document.getElementById('micScoreVal');
const micVerdictText = document.getElementById('micVerdictText');

btnMicGroan.addEventListener('click', async () => {
  micModal.classList.add('active');
  micResultArea.classList.add('hidden');
  micInstructionText.textContent = "Escuchando... Emita su quejido o tos más agónica frente al micrófono durante 3 segundos.";
  
  const visualizer = document.querySelector('.mic-visualizer');
  visualizer.classList.add('recording');

  let peakVolume = 0;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const checkInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const average = sum / dataArray.length;
      if (average > peakVolume) peakVolume = average;
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      stream.getTracks().forEach(track => track.stop());
      visualizer.classList.remove('recording');

      // Calculate score based on mic volume (90 to 100)
      const score = Math.min(100, Math.max(90, Math.floor(peakVolume * 1.2) + 85));
      micScoreVal.textContent = `${score}%`;
      
      const verdicts = [
        "Desempeño digno de un Oscar al Mejor Suspiro Masculino.",
        "Un quejido verdaderamente desgarrador y conmovedor.",
        "La resonancia vocal de tu tos confirma el colapso absoluto.",
        "Potencia acústica agónica sublime. Sydney se enjuga una lágrima."
      ];
      const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
      micVerdictText.textContent = `"${verdict}"`;
      micResultArea.classList.remove('hidden');
      micInstructionText.textContent = "Análisis acústico completado con éxito:";

      const quote = `Análisis de micrófono completado. Le doy a tu quejido un ${score}% de dramatismo. ${verdict}`;
      document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
      speakText(quote);

      // Expose drama badge on avatar
      const scoreNum = document.getElementById('dramaScoreNum');
      const scoreBadge = document.getElementById('dramaScoreBadge');
      if (scoreNum && scoreBadge) {
        scoreNum.textContent = `${score}%`;
        scoreBadge.classList.remove('hidden');
        setTimeout(() => scoreBadge.classList.add('hidden'), 4000);
      }

    }, 3000);

  } catch (err) {
    visualizer.classList.remove('recording');
    micInstructionText.textContent = "Micrófono no detectado o permiso denegado. Generando análisis por simulación...";
    setTimeout(() => {
      const score = Math.floor(Math.random() * 8) + 93;
      micScoreVal.textContent = `${score}%`;
      micVerdictText.textContent = `"Quejido simulado con elegancia teatral."`;
      micResultArea.classList.remove('hidden');
      
      const quote = `Detector activado. Tu dramatismo estimado es de ${score}%. Continúa con tu noble sufrimiento.`;
      document.getElementById('sydneySpeech').innerHTML = `"${quote}"`;
      speakText(quote);
    }, 1000);
  }
});

btnCloseMicModal.addEventListener('click', () => {
  micModal.classList.remove('active');
});


// --- 4. Hospital ECG Audio Synthesizer ---
const btnToggleECG = document.getElementById('btnToggleECG');
const ecgStatusLabel = document.getElementById('ecgStatusLabel');
let ecgInterval = null;
let ecgActive = false;

function playECGBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.value = 900;

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch(e) {}
}

btnToggleECG.addEventListener('click', () => {
  ecgActive = !ecgActive;
  if (ecgActive) {
    btnToggleECG.classList.add('active');
    ecgStatusLabel.textContent = "ON";
    playECGBeep();
    
    // Interval rate depends on state.willToLive
    const getBpmDelay = () => state.willToLive < 30 ? 600 : 1200;
    
    const runEcgLoop = () => {
      if (!ecgActive) return;
      playECGBeep();
      ecgInterval = setTimeout(runEcgLoop, getBpmDelay());
    };
    ecgInterval = setTimeout(runEcgLoop, getBpmDelay());
    
  } else {
    btnToggleECG.classList.remove('active');
    ecgStatusLabel.textContent = "OFF";
    if (ecgInterval) clearTimeout(ecgInterval);
  }
});

// Initialization
function init() {
  if (window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    getFemaleSpanishVoice(voices);
  }
  loadProfilesAndState();
  checkNotificationPermission();
  updateSurvivalUI();
  renderSymptomList();
  renderMedicationList();
  renderProfilesDropdown();

  // If saved will exists, populate and display it
  if (state.will) {
    document.getElementById('willName').value = state.will.name;
    document.getElementById('willConsola').value = state.will.consola;
    document.getElementById('willCulpable').value = state.will.culpable;
    document.getElementById('willWords').value = state.will.words;

    document.getElementById('dispWillName').textContent = state.will.name;
    document.getElementById('dispWillConsola').textContent = state.will.consola;
    document.getElementById('dispWillCulpable').textContent = state.will.culpable;
    document.getElementById('dispWillWords').textContent = state.will.words;
    document.getElementById('willDateDisplay').textContent = state.will.date;
    document.getElementById('dispWillSignature').textContent = state.will.name;

    // Phase 2 tombstone updates
    document.getElementById('tombstoneNameDisp').textContent = state.will.name;
    document.getElementById('tombstoneText').textContent = `
      "Falleció debido a un letal resfriado de ${state.temperature.toFixed(1)}°C. Heredó su PS5/PC a ${state.will.consola} para que continúen su legado. Culpó de su trágico final a ${state.will.culpable}. Últimas palabras: '${state.will.words}'."
    `;

    willDocument.classList.remove('hidden');
    tombstoneDocument.classList.remove('hidden');
  }

  // Load Phase 2 fields into UI inputs
  if (state.sportsOn) {
    fifaToggle.checked = true;
    document.querySelector('.fifa-meter-wrapper').classList.add('active');
  }
  
  if (state.temperature) {
    tempSlider.value = state.temperature;
    tempValue.textContent = state.temperature.toFixed(1);
    const percentage = Math.max(10, Math.min(100, ((state.temperature - 36.0) / 2.5) * 85 + 15));
    mercuryBar.style.height = `${percentage}%`;
    
    if (state.temperature >= 37.0) {
      mercuryBar.className = state.temperature >= 37.3 ? "thermometer-mercury danger" : "thermometer-mercury warning";
      thermometerBulb.className = state.temperature >= 37.3 ? "thermometer-bulb danger" : "thermometer-bulb warning";
      tempStatus.textContent = state.temperature >= 37.3 ? "ESTADO DE INCINERACIÓN. Preparar entierro con honores." : "Fiebre del Desierto Masculino. Iniciar protocolo.";
      tempStatus.style.color = state.temperature >= 37.3 ? 'var(--color-danger)' : 'var(--color-warning)';
      
      // Siren active on page load if temperature is high
      sirenOverlay.classList.add('active');
      if (tempAlarmInterval) clearInterval(tempAlarmInterval);
      tempAlarmInterval = setInterval(playSirenAlarmSound, 2500);
    }
  }

  // Update speech synthesis control state UI
  if (state.speechEnabled) {
    speechIcon.className = "fa-solid fa-volume-high";
    audioStatusText.textContent = "Lectura de voz activa";
  } else {
    speechIcon.className = "fa-solid fa-volume-xmark";
    audioStatusText.textContent = "Lectura de voz inactiva";
  }
}

// Start Application
window.addEventListener('DOMContentLoaded', init);
