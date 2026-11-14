/* =========================================================
   Tradução PT / ES (o português fica no próprio HTML)
   Abra com ?lang=es para começar em espanhol.
   ========================================================= */
const YV_ES = {
  'meta.title': 'YV English | Agenda tu diagnóstico gratuito',
  'meta.ty': 'YV English | ¡Listo!',

  'side.label': 'Diagnóstico gratuito',
  'side.title': 'Descubre el camino más corto <em>hacia tu objetivo.</em>',
  'side.sub': 'Responde 4 preguntas rápidas y te escribo por WhatsApp para agendar un encuentro online, gratuito y sin compromiso.',
  'side.1': '<strong>Tu nivel real</strong>, sin exámenes aburridos.',
  'side.2': '<strong>Lo que te está bloqueando</strong> y cómo superarlo.',
  'side.3': '<strong>El plan ideal</strong> para tu rutina y tu objetivo.',
  'side.student': 'alumno',

  'progress.step': 'Paso',
  'progress.of': 'de',
  'progress.time': 'Menos de 2 minutos',

  's1.title': '¿Qué idioma quieres aprender?',
  's1.hint': 'Toca para elegir.',
  's1.en': 'Inglés',
  's1.es': 'Español',
  's1.both': 'Los dos',

  's2.title': '¿Para qué quieres el idioma?',
  's2.hint': 'Puedes marcar más de una opción.',
  'goal.1': '💼 Trabajo y carrera',
  'goal.2': '✈️ Viajes',
  'goal.3': '🎓 Estudios o intercambio',
  'goal.4': '🌎 Vivir en el exterior',
  'goal.5': '💬 Conversar en el día a día',
  'goal.6': '🎬 Películas, series y cultura',
  's2.level': '¿Cómo describirías tu nivel hoy?',
  'lvl.1': 'Nunca estudié',
  'lvl.1d': 'Empiezo desde cero',
  'lvl.2': 'Básico',
  'lvl.2d': 'Sé algunas palabras y frases',
  'lvl.3': 'Intermedio',
  'lvl.3d': 'Entiendo bastante, pero me bloqueo al hablar',
  'lvl.4': 'Avanzado',
  'lvl.4d': 'Me defiendo bien, quiero perfeccionar',

  's3.title': '¿Qué es lo que más te cuesta hoy?',
  's3.hint': 'Opcional — pero ayuda mucho en el diagnóstico.',
  'pain.1': 'Me bloqueo al hablar',
  'pain.2': 'No entiendo cuando escucho',
  'pain.3': 'Me olvido rápido',
  'pain.4': 'Me da vergüenza hablar',
  'pain.5': 'No sé por dónde empezar',
  'pain.6': 'Falta de constancia',
  's3.when': '¿Cuál es el mejor horario para el diagnóstico?',
  'per.1': '☀️ Mañana',
  'per.2': '🌤️ Tarde',
  'per.3': '🌙 Noche',
  's3.days': '¿Y los mejores días? <small>(opcional)</small>',
  'day.1': 'Lun',
  'day.2': 'Mar',
  'day.3': 'Mié',
  'day.4': 'Jue',
  'day.5': 'Vie',
  'day.6': 'Sáb',

  's4.title': '¿A dónde te escribo?',
  's4.hint': 'Te voy a enviar un mensaje por WhatsApp para coordinar el horario.',
  'f.name': 'Tu nombre',
  'f.wa': 'WhatsApp con código de área',
  'f.email': 'E-mail',
  'f.optional': '(opcional)',
  's4.privacy': '🔒 Tus datos se usan solo para el contacto del diagnóstico. Nada de spam.',

  'btn.prev': 'Volver',
  'btn.next': 'Continuar',
  'btn.submit': 'Quiero mi diagnóstico gratuito',
  'btn.sending': 'Enviando…',

  'err.lang': 'Elige un idioma para continuar.',
  'err.goal': 'Marca al menos un objetivo.',
  'err.level': 'Elige tu nivel actual.',
  'err.period': 'Elige al menos un horario.',
  'err.name': 'Escribe tu nombre.',
  'err.wa': 'Escribe un WhatsApp válido, con código de área.',
  'err.email': 'Revisa el e-mail (o déjalo en blanco).',
  'err.send': 'No fue posible enviar ahora. Inténtalo de nuevo o escríbeme por WhatsApp.',

  'ty.label': 'Solicitud recibida',
  'ty.title': '¡Listo<span class="lead-name"></span>! 💜',
  'ty.sub': 'Recibí tus respuestas. Ahora solo falta coordinar el horario de tu diagnóstico.',
  'ty.next': 'Qué pasa ahora',
  'ty.1': '<strong>Te escribo por WhatsApp</strong> para confirmar el mejor día y horario.',
  'ty.2': '<strong>Hacemos el diagnóstico online</strong>: tu nivel, tu rutina y tu objetivo.',
  'ty.3': '<strong>Recibes la recomendación</strong> del plan ideal — y decides con calma.',
  'ty.cta': 'Adelantar por WhatsApp',
  'ty.ctaHint': '¿No quieres esperar? Envíame un mensaje ahora.',
  'ty.back': 'Volver al sitio',
};

const YV_WA = {
  pt: (l) => `Olá, Yasmin! Acabei de pedir meu diagnóstico gratuito.${l.nome ? `\nNome: ${l.nome}` : ''}${l.idioma ? `\nIdioma: ${l.idioma}` : ''}${l.periodo ? `\nMelhor período: ${l.periodo}` : ''}${l.dias ? `\nDias: ${l.dias}` : ''}`,
  es: (l) => `¡Hola, Yasmin! Acabo de pedir mi diagnóstico gratuito.${l.nome ? `\nNombre: ${l.nome}` : ''}${l.idioma ? `\nIdioma: ${l.idioma}` : ''}${l.periodo ? `\nMejor horario: ${l.periodo}` : ''}${l.dias ? `\nDías: ${l.dias}` : ''}`,
};

const YV = (() => {
  const originals = new Map();
  const ptTitle = document.title;
  let lang = 'pt';

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  function t(key, fallback) {
    return lang === 'es' && YV_ES[key] != null ? YV_ES[key] : fallback;
  }

  function apply(next) {
    lang = next === 'es' ? 'es' : 'pt';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      const key = el.dataset.i18n;
      if (lang === 'es' && YV_ES[key] == null) console.warn('[i18n] falta tradução:', key);
      el.innerHTML = t(key, originals.get(el));
    });
    document.documentElement.lang = lang === 'es' ? 'es' : 'pt-BR';
    const titleKey = document.body.dataset.titleKey || 'meta.title';
    document.title = t(titleKey, ptTitle);
    document.querySelectorAll('[data-site-lang]').forEach((b) => {
      const on = b.dataset.siteLang === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    store.set('yv-lang', lang);
    document.dispatchEvent(new CustomEvent('yv:lang', { detail: lang }));
  }

  function init() {
    const param = new URLSearchParams(location.search).get('lang');
    apply(param || store.get('yv-lang') || 'pt');
    document.querySelectorAll('[data-site-lang]').forEach((b) => {
      b.addEventListener('click', () => apply(b.dataset.siteLang));
    });
  }

  return { init, apply, t, get lang() { return lang; } };
})();

document.addEventListener('DOMContentLoaded', YV.init);
