/* ==========================================================================
   FLOCI AWS COURSE - Shared JS
   Terminal simulator, quizzes, nav, progress, copy buttons
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('nav-burger');
  const links = document.getElementById('nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('mobile'));
  }

  /* ---------- Reading progress bar ---------- */
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.innerHeight;
      const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Active TOC link highlight ---------- */
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length) {
    const sections = [...tocLinks].map(a => {
      const id = a.getAttribute('href').slice(1);
      return { el: document.getElementById(id), a };
    }).filter(s => s.el);
    const onScroll = () => {
      let current = sections[0];
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= 90) current = s;
      }
      for (const s of sections) s.a.classList.toggle('on', s === current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Copy helper ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  /* ---------- Terminal Simulator ---------- */
  document.querySelectorAll('.sim').forEach(sim => {
    const runBtn = sim.querySelector('.btn-play');
    const copyBtn = sim.querySelector('.btn-copy');
    const body = sim.querySelector('.sim-body');
    if (!runBtn || !body) return;

    // Parse steps: look for <s-cmd> / <s-out> children OR data-steps JSON
    let steps = [];
    try {
      if (sim.dataset.steps) steps = JSON.parse(sim.dataset.steps);
    } catch (e) { steps = []; }

    if (!steps.length) {
      body.querySelectorAll('.s-cmd, .s-out').forEach(node => {
        const type = node.classList.contains('s-cmd') ? 'cmd' : 'out';
        const text = node.getAttribute('data-text') || node.textContent.trim();
        const color = node.getAttribute('data-color') || '';
        steps.push({ type, text, color });
      });
    }

    let timer = null;
    let cancelled = false;

    const clear = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      cancelled = true;
      body.querySelectorAll('.sim-dynamic').forEach(n => n.remove());
      body.querySelectorAll('.sim-cursor').forEach(n => n.remove());
      runBtn.classList.remove('playing');
      runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run example';
    };

    runBtn.addEventListener('click', () => {
      clear();
      cancelled = false;
      runBtn.classList.add('playing');
      runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';

      let idx = 0;
      const cursor = document.createElement('span');
      cursor.className = 'sim-cursor';

      const tick = () => {
        if (cancelled) return;
        const step = steps[idx];
        if (!step) {
          cursor.remove();
          runBtn.classList.remove('playing');
          runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Replay';
          return;
        }
        if (step.type === 'cmd') {
          // typewriter effect
          const line = document.createElement('div');
          line.className = 's-line sim-dynamic cmd';
          line.appendChild(cursor);
          body.appendChild(line);
          let ci = 0;
          const typeTick = () => {
            if (cancelled) return;
            if (ci <= step.text.length) {
              cursor.textContent = '';
              line.childNodes.forEach(n => { if (n !== cursor) n.remove(); });
              line.appendChild(document.createTextNode(step.text.slice(0, ci)));
              line.appendChild(cursor);
              ci++;
              const speed = step.speed || 28;
              timer = setTimeout(typeTick, speed);
            } else {
              idx++;
              timer = setTimeout(tick, step.delay || 250);
            }
          };
          typeTick();
        } else {
          const line = document.createElement('div');
          line.className = 's-line sim-dynamic out ' + (step.color || '');
          line.textContent = step.text;
          body.appendChild(line);
          body.scrollTop = body.scrollHeight;
          idx++;
          timer = setTimeout(tick, step.delay || 200);
        }
      };
      tick();
    });

    if (copyBtn) {
      const cmdText = steps.filter(s => s.type === 'cmd').map(s => s.text).join('\n');
      copyBtn.addEventListener('click', async () => {
        await copyText(cmdText);
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyBtn.style.color = '#4ade80';
        setTimeout(() => { copyBtn.innerHTML = orig; copyBtn.style.color = ''; }, 1500);
      });
    }
  });

  /* ---------- Quiz logic ---------- */
  document.querySelectorAll('.quiz-item').forEach(q => {
    q.querySelectorAll('.quiz-opt').forEach(opt => {
      const radio = opt.querySelector('input');
      if (!radio) return;
      opt.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        radio.checked = true;
        q.querySelectorAll('.quiz-opt').forEach(o => {
          o.classList.remove('correct', 'wrong');
        });
        const correct = radio.value === '1';
        opt.classList.add(correct ? 'correct' : 'wrong');
      });
      radio.addEventListener('change', () => {
        q.querySelectorAll('.quiz-opt').forEach(o => {
          o.classList.remove('correct', 'wrong');
        });
        const correct = radio.value === '1';
        opt.classList.add(correct ? 'correct' : 'wrong');
      });
    });
  });

  /* ---------- Copy buttons on code blocks ---------- */
  document.querySelectorAll('.codeblock').forEach(cb => {
    const copyBtn = cb.querySelector('.cb-copy');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', async () => {
      const pre = cb.querySelector('pre');
      const text = pre ? pre.innerText : '';
      await copyText(text);
      const orig = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(() => { copyBtn.innerHTML = orig; }, 1500);
    });
  });

  /* ---------- Chapter progress (localStorage) ---------- */
  const progressKey = 'floci-aws-progress';
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(progressKey) || '{}'); }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    localStorage.setItem(progressKey, JSON.stringify(p));
  }

  // Mark complete button
  document.querySelectorAll('.mark-done').forEach(btn => {
    const ch = btn.dataset.chapter;
    const update = () => {
      const p = getProgress();
      if (p[ch]) {
        btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Completed';
        btn.classList.add('btn-play');
        btn.classList.remove('btn-next');
      } else {
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mark chapter as done';
        btn.classList.remove('btn-play');
        btn.classList.add('btn-next');
      }
    };
    update();
    btn.addEventListener('click', () => {
      const p = getProgress();
      p[ch] = !p[ch];
      saveProgress(p);
      update();
    });
  });

  // Home page: show done state on cards
  const cards = document.querySelectorAll('.chap-card[data-chapter]');
  if (cards.length) {
    const p = getProgress();
    cards.forEach(c => {
      const done = p[c.dataset.chapter];
      if (done) {
        c.classList.add('done');
        const tag = c.querySelector('.done-tag');
        if (tag) tag.style.display = 'inline-block';
      }
    });
  }

  /* ---------- Reveal-on-scroll fade ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('fade-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
