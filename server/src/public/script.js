(function () {
  // Same-origin API (this page is served by the Melo server)
  const API_BASE = '';
  const SIGN_IN_URL = 'http://melo-app.com/sign-in';

  // Read query params from the reset link URL.
  // A Proxy over URLSearchParams lets us access params as properties:
  //   params.token  instead of  searchParams.get('token')
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });

  const token = params.token || '';
  const userId = params.userId || '';

  // Optional preview mode: ?preview=form|success|error|loading
  const preview = params.preview;

  const els = {
    verifyingState: document.getElementById('verifyingState'),
    formState: document.getElementById('formState'),
    successState: document.getElementById('successState'),
    deadState: document.getElementById('deadState'),
    form: document.getElementById('resetForm'),
    password: document.getElementById('password'),
    confirm: document.getElementById('confirm'),
    submitBtn: document.getElementById('submitBtn'),
    submitLabel: document.getElementById('submitLabel'),
    spinner: document.getElementById('spinner'),
    errorAlert: document.getElementById('errorAlert'),
    errorText: document.getElementById('errorText'),
    reqLen: document.getElementById('req-len'),
    reqMix: document.getElementById('req-mix'),
    reqMatch: document.getElementById('req-match'),
    signInLink: document.getElementById('signInLink'),
    deadSignInLink: document.getElementById('deadSignInLink')
  };

  els.signInLink.href = SIGN_IN_URL;
  els.deadSignInLink.href = SIGN_IN_URL;

  // ---- preview mode (for designing without a backend) ----
  if (preview) {
    if (preview === 'success') { show('success'); return; }
    if (preview === 'error') { show('form'); showError('This is a preview of the error message.'); return; }
    if (preview === 'loading') { show('form'); setLoading(true); return; }
    // preview=form -> just show the form
    show('form');
    wireForm();
    return;
  }

  // If the link has no token/userId, it can't be used
  if (!token || !userId) { show('dead'); return; }

  // Verify the reset token BEFORE showing the form
  verifyToken();

  // ---------------------------------------------------------
  // ---- verify the reset token on page load ----
  async function verifyToken() {
    show('verifying');
    try {
      const res = await fetch(API_BASE + '/auth/verify-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId })
      });

      // valid token -> let them set a new password
      if (res.ok) {
        show('form');
        wireForm();
        return;
      }

      // invalid / expired token -> show the expired screen
      show('dead');
    } catch (err) {
      // network error -> treat as expired so they request a fresh link
      show('dead');
    }
  }

  function wireForm() {
    // show / hide password toggles
    document.querySelectorAll('.toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('data-target'));
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });

    els.password.addEventListener('input', checkRules);
    els.confirm.addEventListener('input', checkRules);
    checkRules();

    els.form.addEventListener('submit', onSubmit);
  }

  // ---- SUBMIT: handles loading / success / error ----
  async function onSubmit(e) {
    e.preventDefault();
    hideError();
    if (!checkRules()) return;

    // LOADING
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, password: els.password.value })
      });

      let data = {};
      try { data = await res.json(); } catch (_) {}

      // SUCCESS
      if (res.ok) { show('success'); return; }

      // token no longer valid -> expired screen
      if (res.status === 401 || res.status === 403) { show('dead'); return; }

      // ERROR (validation / server)
      showError(data.message || 'Something went wrong. Please try again.');
    } catch (err) {
      // ERROR (network)
      showError('No internet! Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ---- live validation (matches the server rules) ----
  function checkRules() {
    const pw = els.password.value;
    const cf = els.confirm.value;
    const len = pw.length >= 8 && pw.length <= 100;
    const mix = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(pw);
    const match = pw.length > 0 && pw === cf;
    toggleReq(els.reqLen, len);
    toggleReq(els.reqMix, mix);
    toggleReq(els.reqMatch, match);
    const ok = len && mix && match;
    els.submitBtn.disabled = !ok;
    return ok;
  }
  function toggleReq(el, met) { el.classList.toggle('met', met); }

  // ---- LOADING state ----
  function setLoading(on) {
    els.submitBtn.disabled = on || !checkRules();
    els.spinner.style.display = on ? 'block' : 'none';
    els.submitLabel.textContent = on ? 'Casting…' : 'Cast my password ✨';
  }

  // ---- ERROR state ----
  function showError(msg) {
    els.errorText.textContent = msg;
    els.errorAlert.style.display = 'flex';
    els.password.classList.add('invalid');
  }
  function hideError() {
    els.errorAlert.style.display = 'none';
    els.password.classList.remove('invalid');
  }

  // ---- switch between form / success / expired screens ----
  function show(which) {
    els.verifyingState.style.display = which === 'verifying' ? 'block' : 'none';
    els.formState.style.display = which === 'form' ? 'block' : 'none';
    els.successState.style.display = which === 'success' ? 'block' : 'none';
    els.deadState.style.display = which === 'dead' ? 'block' : 'none';
  }
})();
