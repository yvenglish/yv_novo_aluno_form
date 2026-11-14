/* =========================================================
   Formulário de diagnóstico — etapas, validação e envio
   ========================================================= */
const form = document.getElementById('form');
const steps = Array.from(form.querySelectorAll('.step'));
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');
const errorEl = document.getElementById('error');
const stepNum = document.getElementById('step-num');
const fill = document.getElementById('progress-fill');
const waInput = document.getElementById('whatsapp');

const PT_ERRORS = {
  'err.lang': 'Escolha um idioma para continuar.',
  'err.goal': 'Marque pelo menos um objetivo.',
  'err.level': 'Escolha seu nível atual.',
  'err.period': 'Escolha pelo menos um período.',
  'err.name': 'Digite seu nome.',
  'err.wa': 'Digite um WhatsApp válido, com DDD.',
  'err.email': 'Confira o e-mail (ou deixe em branco).',
  'err.send': 'Não foi possível enviar agora. Tente de novo ou me chame no WhatsApp.',
};
const msg = (key) => YV.t(key, PT_ERRORS[key]);

let current = 0;

/* ---------- Navegação ---------- */
function render() {
  steps.forEach((s, i) => s.classList.toggle('active', i === current));
  stepNum.textContent = current + 1;
  fill.style.width = `${((current + 1) / steps.length) * 100}%`;
  btnPrev.hidden = current === 0;
  const last = current === steps.length - 1;
  btnNext.hidden = last;
  btnSubmit.hidden = !last;
  // No passo 1 a escolha já avança sozinha
  btnNext.classList.toggle('is-quiet', current === 0);
  clearError();
}

function go(to) {
  current = Math.max(0, Math.min(steps.length - 1, to));
  render();
  const card = document.querySelector('.card');
  if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const focusable = steps[current].querySelector('input:not([type=hidden])');
  if (focusable && current === steps.length - 1) setTimeout(() => focusable.focus({ preventScroll: true }), 250);
}

/* ---------- Validação ---------- */
function showError(text, target) {
  errorEl.textContent = text;
  errorEl.classList.add('show');
  if (target) {
    target.classList.add('shake');
    setTimeout(() => target.classList.remove('shake'), 450);
  }
}
function clearError() {
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
}

const digits = (v) => v.replace(/\D/g, '');

function validate() {
  clearError();
  const step = steps[current];

  for (const group of step.querySelectorAll('[data-required]')) {
    if (!group.querySelector('input:checked')) {
      showError(msg(group.dataset.errorKey), group);
      return false;
    }
  }

  if (current === steps.length - 1) {
    const nome = form.nome;
    if (nome.value.trim().length < 2) { nome.classList.add('invalid'); showError(msg('err.name'), nome); nome.focus(); return false; }
    if (digits(waInput.value).length < 10) { waInput.classList.add('invalid'); showError(msg('err.wa'), waInput); waInput.focus(); return false; }
    const email = form.email;
    if (email.value.trim() && !email.checkValidity()) { email.classList.add('invalid'); showError(msg('err.email'), email); email.focus(); return false; }
  }
  return true;
}

/* ---------- Interações ---------- */
btnNext.addEventListener('click', () => { if (validate()) go(current + 1); });
btnPrev.addEventListener('click', () => go(current - 1));

// Escolher o idioma já avança e ajusta as cores
form.querySelectorAll('input[name="idioma"]').forEach((r) => {
  r.addEventListener('change', () => {
    setTheme(r.value);
    if (current === 0) setTimeout(() => go(1), 260);
  });
});

function setTheme(idioma) {
  document.body.classList.toggle('theme-es', idioma === 'Espanhol');
}

form.addEventListener('change', (e) => {
  if (e.target.matches('input[type=checkbox], input[type=radio]')) clearError();
});

// Máscara de WhatsApp brasileiro (números com + ficam livres)
waInput.addEventListener('input', () => {
  const v = waInput.value;
  if (v.trim().startsWith('+')) return;
  const d = digits(v).slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  waInput.value = out;
});

/* ---------- Envio ---------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Enter num passo intermediário = continuar
  if (current < steps.length - 1) { if (validate()) go(current + 1); return; }
  if (!validate()) return;

  const fd = new FormData(form);
  const data = Object.fromEntries(fd);
  ['objetivo[]', 'dificuldades[]', 'periodo[]', 'dias[]'].forEach((name) => {
    const values = fd.getAll(name);
    delete data[name];
    data[name.replace('[]', '')] = values.length ? values.join(', ') : '—';
  });
  data.idioma_do_site = YV.lang;
  data.subject = `Novo diagnóstico: ${data.nome} · ${data.idioma}`;
  if (!data.plano_de_interesse) delete data.plano_de_interesse;

  const label = btnSubmit.textContent;
  btnSubmit.disabled = true;
  btnSubmit.textContent = YV.t('btn.sending', 'Enviando…');

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'erro');

    try {
      sessionStorage.setItem('yv-lead', JSON.stringify({
        nome: data.nome.trim().split(' ')[0],
        idioma: data.idioma,
        periodo: data.periodo,
        dias: data.dias === '—' ? '' : data.dias,
      }));
    } catch (err) { /* ignore */ }

    location.href = `obrigada.html${YV.lang === 'es' ? '?lang=es' : ''}`;
  } catch (err) {
    showError(msg('err.send'));
    btnSubmit.disabled = false;
    btnSubmit.textContent = label;
  }
});

/* ---------- Início ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);

  // ?plano=Fluency vindo do site
  const plano = params.get('plano');
  if (plano) document.getElementById('plano').value = plano.slice(0, 40);

  // ?idioma=en|es|ambos pré-seleciona o idioma
  const map = { en: 'Inglês', es: 'Espanhol', ambos: 'Inglês e Espanhol' };
  const pre = map[(params.get('idioma') || '').toLowerCase()];
  if (pre) {
    const radio = form.querySelector(`input[name="idioma"][value="${pre}"]`);
    if (radio) { radio.checked = true; setTheme(pre); }
  }

  render();
});

// Mensagens de erro acompanham a troca de idioma
document.addEventListener('yv:lang', clearError);
