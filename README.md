# MachoMedic

**Consola de supervivencia para el resfriado masculino terminal.**

MachoMedic es una app web de humor negro, burlona y un poco pícara: ayuda a las señoras (y a quien tenga la paciencia) a **trackear paracetamol y otros remedios** mientras el paciente dramatiza un resfriado como si fuera el final de *Game of Thrones*.

La idea no es reemplazar al médico. Es hacer **más lúdico** el cuidado y la recuperación: recordatorios de dosis, bitácora de síntomas, termómetro del Apocalipsis y una enfermera virtual que se burla con cariño (y sin piedad).

> *“¿37.1 °C? Código rojo. Traigan sopa, mantas y oraciones. La PS5 ya está en el testamento.”*

---

## ¿Para quién es?

| Persona | Qué hace en la app |
|---|---|
| **La señora / pareja cuidadora** | Programa alertas de paracetamol, caldo, té o “mimitos”. Mira el drama score. Manda el SOS por WhatsApp a la suegra si hace falta. |
| **El enfermo heroico** | Registra estornudos “mortales”, pide mimos, emite quejidos, redacta su testamento y jura que no llega al domingo. |
| **El grupo de amigos** | Comparte el reporte crítico y se ríe (con respeto clínico… o sin él). |

---

## Concepto

Las enfermedades leves (resfriado, gripe suave, “me duele todo”) suelen venir con:

1. Un hombre convencido de que está muriendo.
2. Una persona cansada de recordar la pastilla de las 4 horas.
3. Cero diversión en el proceso.

MachoMedic convierte ese ritual en un **juego de supervivencia doméstica**:

- Tracking realista de **medicamentos y horarios** (paracetamol, vitamina C, té, caldo…).
- Narrativa exagerada: síntomas épicos, esperanza de vida, lápida, testamento.
- Tono **burlón y pícaro**: ironía, coqueteo absurdo con la enfermera virtual y zero solemnidad médica.

Detalle de producto y voz de marca: [`docs/CONCEPTO.md`](docs/CONCEPTO.md).  
Aviso importante sobre salud: [`docs/AVISO-MEDICO.md`](docs/AVISO-MEDICO.md).

---

## Qué incluye (Fases 1–4)

### Núcleo de cuidado
- **Dosis de supervivencia** — elixires rápidos (caldo, gominola de Vitamina C, té, paracetamol 1 g) y recordatorios programables.
- **Bitácora de agonía** — síntomas con “nivel de sufrimiento” en escala masculina.
- **Termómetro del Apocalipsis** — temperatura con sirena dramática si el mercurio se pone intenso.
- **Notificaciones** — recordatorios de dosis (si el navegador lo permite).
- **Perfiles de pacientes** — varios “moribundos” en el mismo hogar / grupo.

### Humor negro & ludificación
- Enfermera virtual (Sydney) con diálogos irónicos y TTS.
- Contador de esperanza de vida y timer de “muerte estimada”.
- Fifa-O-Meter: el partido puede curar milagrosamente al paciente.
- Llamada urgente a mamá (simulación teatral).
- Quejido sintético y analizador de suspiro por micrófono.
- Testamento express + lápida imprimible.
- Último deseo, Modo Esposa, audio estilo ECG y alerta SOS por WhatsApp.

Historial por fases: [`CHANGELOG.md`](CHANGELOG.md).

---

## Stack

- HTML / CSS / JavaScript (vanilla)
- [Vite](https://vitejs.dev/) para dev y build
- Persistencia en `localStorage` (sin backend)
- Deploy pensado para [Netlify](https://www.netlify.com/) (`netlify.toml`)

---

## Arrancar en local

Requisitos: Node.js 18+.

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

La salida queda en `dist/` (lo que publica Netlify).

---

## Estructura

```
machomedic/
├── index.html          # UI principal
├── app.js              # Lógica, perfiles, audio, recordatorios
├── styles.css          # Estilos y animaciones
├── public/assets/      # Avatares de la enfermera virtual
├── docs/               # Concepto, aviso médico, etc.
├── netlify.toml
└── package.json
```

---

## Privacidad (versión actual)

Todo vive en el navegador (`localStorage`). No hay cuenta, ni servidor de pacientes, ni envío automático de historial clínico. El botón de WhatsApp solo abre un mensaje prearmado que **tú** eliges enviar.

---

## Contribuciones

Ideas, bugs y pull requests bienvenidos — siempre que respeten el tono (humor negro ≠ crueldad real) y el [aviso médico](docs/AVISO-MEDICO.md). Guía breve: [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## Licencia / espíritu

Hecho con amor, drama y humor negro. Ningún hombre fue dañado de gravedad (aunque ellos juraron que sí).

**MachoMedic Inc.** — *Monitoreo de emergencia para el resfriado masculino terminal.*
