# Concepto de producto — MachoMedic

## Elevator pitch

App web para que **las señoras de tus amigos** (y cualquier cuidadora/cuidador con sentido del humor) trackeen **paracetamol y otros remedios** de enfermedades leves, mientras el paciente vive su resfriado como una epopeya. Humor **muy negro**, **burlón** y **pícaro**: el cuidado se vuelve un juego, no un parte clínico aburrido.

---

## Problema que resuelve (en serio, con risa)

| Realidad | Sin MachoMedic | Con MachoMedic |
|---|---|---|
| “¿Ya te tomaste la pastilla?” | Discusión / olvido | Alerta programada + burla cariñosa |
| El enfermo magnifica todo | Frustración | El drama **es** el gameplay |
| Cuidar un resfriado es tedioso | Checklist seco | Consola de supervivencia lúdica |
| Hay que avisar a la familia | Mensajes largos | SOS WhatsApp listo para copiar/enviar |

MachoMedic no inventa medicina. **Ludifica el ritual doméstico** de cuidar a alguien con un malestar leve.

---

## Usuaria primaria: “la Señora”

Perfil objetivo:

- Pareja, esposa, novia o amiga a cargo del enfermo.
- Quiere saber **cuándo fue la última dosis** y **cuándo toca la siguiente**.
- Tolera (o disfruta) reírse del macho herido en el sofá.
- No busca un EHR hospitalario: busca **claridad + diversión**.

Jobs to be done:

1. Registrar / programar medicamentos (paracetamol, antigripales, té, caldo…).
2. Ver de un vistazo el “estado crítico” del paciente (temperatura, síntomas, esperanza de vida ficticia).
3. Compartir el caos con humor (WhatsApp, perfiles, Modo Esposa).
4. Mantener al enfermo entretenido para que deje de preguntar “¿me voy a morir?” cada diez minutos.

---

## Usuarios secundarios

- **El paciente**: interactúa, se queja, pide mimos, firma testamento.
- **El círculo** (amigos, mamá, suegra): reciben alertas teatrales, no historiales clínicos.

---

## Tono de marca (voz)

### Sí

- Humor **negro** sobre el drama masculino ante un resfriado.
- Burla **afectuosa**: se ríe *con* el personaje del enfermo, no humilla a personas reales.
- Picardía ligera: coqueteo absurdo con la enfermera virtual, guiños, doble sentido suave.
- Español cercano, oral, latinoamericano-friendly (sin forzar slang de un solo país).
- Exageración médica absurda (“fiebre del desierto a 37.1 °C”).

### No

- Consejos médicos reales disfrazados de chiste.
- Crueldad hacia enfermedades graves, duelo real o salud mental.
- Misoginia: la Señora no es “la aguafiestas”; es la **operadora de la consola**.
- Lenguaje clínico frío o UI de hospital serio (salvo parodia consciente: ECG, sirenas, lápida).

### Fórmulas útiles

- Diagnóstico ridículo + instrucción útil: *“Código rojo. Próxima pastilla en 3:45:12. Mientras tanto, cobija.”*
- Cumplido venenoso: *“Qué valiente tomarte el paracetamol sin llorar… mucho.”*
- Picardía: *“Último deseo aceptado. Ahora duérmete, drama king.”*

---

## Propuesta de valor

1. **Utilidad**: recordatorios y bitácora de medicación / síntomas para males leves.
2. **Ludificación**: meters, timers, perfiles, elixires, logros dramáticos.
3. **Narrativa**: Sydney, testamento, lápida, Fifa-O-Meter, SOS.
4. **Social light**: WhatsApp y modo pareja sin cuentas ni backend (v1).

---

## Principios de producto

1. **La pastilla es sagrada; el drama es opcional pero recomendado.**  
   El tracking de dosis debe ser claro aunque el copy sea absurdo.
2. **Un hogar, varios moribundos.**  
   Perfiles locales para la familia / el grupo.
3. **Todo en el dispositivo.**  
   Sin servidor de datos clínicos en la versión actual.
4. **Nunca suplantar criterio médico.**  
   Ver [`AVISO-MEDICO.md`](AVISO-MEDICO.md).
5. **Una acción = una burla + un feedback útil.**  
   Cada registro de síntoma o dosis mueve UI y diálogo.

---

## Alcance actual vs. no-alcance

### En scope (hoy)

- SPA en el navegador, Vite + Netlify.
- Medicamentos y síntomas en `localStorage`.
- Humor, audio teatral, perfiles, SOS WhatsApp manual.

### Fuera de scope (por ahora)

- Diagnóstico, dosis recomendadas por IA, telemedicina.
- Cuentas cloud, sync multi-dispositivo, roles reales de cuidador.
- Integración con farmacias o wearables.
- Enfermedades graves, crónicas o pediátricas como caso de uso serio.

---

## Norte de roadmap (ideas, no compromiso)

- Vista “Señora” más clara: timeline de dosis del día, “última pastilla hace X”.
- Plantillas de esquemas comunes (paracetamol cada 6–8 h, etc.) con copy dramático.
- Compartir perfil solo lectura por link (cuando haya backend).
- Log de recuperación: “días desde el último estornudo heroico”.
- Modo solo-cuidadora (menos botones de quejido, más control de alertas).

Cualquier feature nueva debe pasar el test:  
**¿Ayuda a cuidar / trackear *y* mantiene el humor negro, burlón y pícaro?**  
Si solo es chiste vacío o solo es clínico aburrido, no entra.
