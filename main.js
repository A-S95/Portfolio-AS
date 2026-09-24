'use strict';

// Invisible hCaptcha — nothing is shown on the form; the check only runs when
// the visitor presses "Send Message" (a challenge pops up only if hCaptcha
// is suspicious). The widget is rendered lazily in the current theme and
// dropped on theme change so the next send renders it in the new one.
const HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'; // Web3Forms free-plan key
let captchaWidgetId = null;

const getCaptchaToken = () => {
    const box = document.querySelector('[data-captcha-box]');
    if (!window.hcaptcha || !box) return Promise.reject(new Error('captcha-unavailable'));

    if (captchaWidgetId === null) {
        captchaWidgetId = window.hcaptcha.render(box, {
            sitekey: HCAPTCHA_SITEKEY,
            size: 'invisible',
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
        });
    }
    return window.hcaptcha.execute(captchaWidgetId, { async: true }).then(({ response }) => response);
};

const resetCaptcha = () => {
    if (window.hcaptcha && captchaWidgetId !== null) window.hcaptcha.reset(captchaWidgetId);
};

const dropCaptcha = () => {
    if (window.hcaptcha && captchaWidgetId !== null) window.hcaptcha.remove(captchaWidgetId);
    captchaWidgetId = null;
};

// Botao tema Escuro e branco
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle-theme');

    // Aplica o tema salvo (se houver)
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      toggle.checked = true;
    }

    // Troca o tema ao clicar
    toggle.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      dropCaptcha();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    navLinks.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Remover classe .active de todos os botões e artigos
        navLinks.forEach(link => link.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        // Adicionar classe .active no botão clicado e respetivo artigo
        btn.classList.add("active");
        pages[index].classList.add("active");

        // Abrir a nova aba a partir do topo (no telemóvel o menu fica fixo em
        // baixo, por isso sem isto a aba nova abria a meio da página)
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });

});

//Opening or closing side bar
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })
}

// Get modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".modal-close");

// Preview button (eye icon) on each project image opens a lightbox
if (modal && modalImg && closeBtn) {
    const openModal = (src, alt) => {
        modalImg.src = src;
        modalImg.alt = alt || "";
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".project-item-icon-box").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const img = btn.closest(".project-img")?.querySelector("img");
            if (img) openModal(img.src, img.alt);
        });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}

// Recommendation letter preview modal (opens the PDF inline; the split button's right side downloads directly)
const pdfModal = document.getElementById("pdf-modal");
const pdfFrame = document.getElementById("pdf-modal-frame");
const pdfOpenBtn = document.querySelector("[data-pdf-open]");
const pdfCloseBtn = document.querySelector("[data-pdf-close]");
const pdfSrc = "/cv/carta_recomendacao.pdf";

if (pdfModal && pdfFrame && pdfOpenBtn && pdfCloseBtn) {
    const openPdfModal = () => {
        pdfFrame.src = pdfSrc;
        pdfModal.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closePdfModal = () => {
        pdfModal.classList.remove("open");
        pdfFrame.src = "";
        document.body.style.overflow = "";
    };

    pdfOpenBtn.addEventListener("click", openPdfModal);
    pdfCloseBtn.addEventListener("click", closePdfModal);
    pdfModal.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePdfModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePdfModal();
    });
}

// Case study modal (CentiSible)
const caseModal = document.getElementById("case-modal");
const caseOpenBtn = document.querySelector("[data-case-open]");

if (caseModal && caseOpenBtn) {
    const openCase = () => {
        caseModal.classList.add("open");
        document.body.style.overflow = "hidden";
        caseModal.querySelector("[data-case-close]").focus();
    };

    const closeCase = () => {
        if (!caseModal.classList.contains("open")) return;
        caseModal.classList.remove("open");
        document.body.style.overflow = "";
        caseOpenBtn.focus();
    };

    caseOpenBtn.addEventListener("click", openCase);
    caseModal.querySelector("[data-case-close]").addEventListener("click", closeCase);
    caseModal.addEventListener("click", (e) => {
        if (e.target === caseModal) closeCase();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCase();
    });
}

// Avatar flip card: the back shows availability (tablet/desktop only; on
// phones the avatar is too small, so availability is a card in About)
const avatarBox = document.querySelector("[data-avatar]");
if (avatarBox) {
    const flipBtn = avatarBox.querySelector("[data-avatar-flip]");
    const hint = avatarBox.querySelector("[data-avatar-hint]");
    const phoneMq = window.matchMedia("(max-width: 579px)");
    const HINT_KEY = "avatar-hint-seen";

    try {
        if (localStorage.getItem(HINT_KEY)) hint.classList.add("is-hidden");
    } catch {
        // Storage blocked — the hint just shows until the first flip
    }

    const setFlipped = (flipped) => {
        flipBtn.classList.toggle("is-flipped", flipped);
        avatarBox.classList.toggle("is-flipped", flipped);
        flipBtn.setAttribute("aria-pressed", String(flipped));
    };

    // Phones: the badge on the avatar takes you to the availability card
    const showAvailabilityCard = () => {
        const card = document.querySelector("[data-availability]");
        const aboutLink = [...document.querySelectorAll("[data-nav-link]")]
            .find((link) => link.textContent.trim() === "About");
        const onAbout = document.querySelector('[data-page="about"]')?.classList.contains("active");
        if (!onAbout) aboutLink?.click();
        // After the tab switch (which scrolls to the top) has started
        setTimeout(() => {
            card?.scrollIntoView({ behavior: "smooth", block: "center" });
            card?.classList.remove("is-highlight");
            void card?.offsetWidth;
            card?.classList.add("is-highlight");
        }, onAbout ? 0 : 350);
    };

    flipBtn.addEventListener("click", () => {
        if (phoneMq.matches) {
            showAvailabilityCard();
            return;
        }
        setFlipped(!flipBtn.classList.contains("is-flipped"));
        hint.classList.add("is-hidden");
        try {
            localStorage.setItem(HINT_KEY, "1");
        } catch {
            // Not remembered — fine
        }
    });

    // Turn back when clicking anywhere else or pressing Escape
    document.addEventListener("click", (e) => {
        if (!avatarBox.contains(e.target)) setFlipped(false);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setFlipped(false);
    });
}

// Availability card: the ticks draw themselves once it scrolls into view,
// and "Let's talk" jumps to the Contact tab
const availability = document.querySelector("[data-availability]");
if (availability) {
    new IntersectionObserver((entries, obs) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            availability.classList.add("is-visible");
            obs.disconnect();
        }
    }, { threshold: .5 }).observe(availability);

    availability.querySelector("[data-go-contact]")?.addEventListener("click", () => {
        const contactLink = [...document.querySelectorAll("[data-nav-link]")]
            .find((link) => link.textContent.trim() === "Contact");
        contactLink?.click();
    });
}

// Expand/collapse job cards (Experience, Education entries, Skills, Languages)
document.querySelectorAll('[data-job-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('[data-job]');
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
    });
});

// Contact form — sent to Web3Forms via fetch so the visitor stays on the page
const contactForm = document.querySelector('[data-form]');
const contactBtn = document.querySelector('[data-form-btn]');
const contactStatus = document.querySelector('[data-form-status]');

if (contactForm && contactBtn && contactStatus) {
    const btnLabel = contactBtn.querySelector('span');
    const defaultLabel = btnLabel.textContent;

    const showFormStatus = (message, type) => {
        contactStatus.textContent = message;
        contactStatus.className = `form-status ${type}`;
        contactStatus.hidden = false;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        contactBtn.disabled = true;
        btnLabel.textContent = 'Verifying…';
        contactStatus.hidden = true;

        getCaptchaToken()
            .catch((err) => {
                const closed = err && (err.message === 'challenge-closed' || err === 'challenge-closed');
                throw new Error(closed ? 'captcha-closed' : 'captcha-failed');
            })
            .then((token) => {
                btnLabel.textContent = 'Sending…';
                const formData = new FormData(contactForm);
                formData.set('h-captcha-response', token);

                return fetch(contactForm.action, {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: formData,
                }).then((res) => res.json());
            })
            .then((data) => {
                if (!data.success) throw new Error(data.message);
                contactForm.reset();
                showFormStatus("Thanks for your message! I'll get back to you soon.", 'success');
            })
            .catch((err) => {
                if (err.message === 'captcha-closed') {
                    showFormStatus('Please complete the verification to send your message.', 'error');
                } else {
                    showFormStatus("Something went wrong. Please try again or email me directly.", 'error');
                }
            })
            .finally(() => {
                // Each captcha token is single-use, so a new one is needed for the next send
                resetCaptcha();
                contactBtn.disabled = false;
                btnLabel.textContent = defaultLabel;
            });
    });
}

// Filterable skills cloud
const skillsFilters = document.querySelectorAll('.skills-filter');
const skillsTags = document.querySelectorAll('.skills-tags .tech-tag');

skillsFilters.forEach(btn => {
    btn.addEventListener('click', () => {
        skillsFilters.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        skillsTags.forEach(tag => {
            const match = filter === 'all' || tag.dataset.category === filter;
            tag.classList.toggle('dimmed', !match);
        });
    });
});

// "Measure twice, cut once" — plays the tape-measure underline when the
// phrase scrolls into view, and again on hover
const measureHighlight = document.querySelector('.about-highlight');
if (measureHighlight) {
    const playMeasure = () => {
        measureHighlight.classList.remove('is-measuring');
        void measureHighlight.offsetWidth; // restart the CSS animation
        measureHighlight.classList.add('is-measuring');
    };

    new IntersectionObserver((entries, obs) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            setTimeout(playMeasure, 400);
            obs.disconnect();
        }
    }, { threshold: 1 }).observe(measureHighlight);

    measureHighlight.addEventListener('mouseenter', () => {
        // Don't restart while it's still mid-measure
        const running = measureHighlight.getAnimations({ subtree: true }).some((a) => a.playState === 'running');
        if (!running) playMeasure();
    });
}

// Scroll reveal for content sections
document.addEventListener('DOMContentLoaded', () => {
    const fadeUpEls = document.querySelectorAll('.service-item, .clients');
    const fadeOnlyEls = document.querySelectorAll('.job-card');

    fadeUpEls.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });

    fadeOnlyEls.forEach((el, i) => {
        el.classList.add('reveal', 'reveal-fade');
        el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    // threshold 0 + a bottom inset rather than a ratio: an expanded card can be
    // several screens tall on mobile, so a ratio like 0.15 may never be
    // reached and the card would stay invisible.
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    fadeUpEls.forEach(el => revealObserver.observe(el));
    fadeOnlyEls.forEach(el => revealObserver.observe(el));
});

// Recent GitHub activity widget (sidebar-stack) — fetches a pool of commits and
// shows as many as fit the space the flex layout gives it, so it grows/shrinks
// along with the content column (e.g. expanding a Resume accordion) instead of
// leaving dead space or forcing the content column taller than it needs to be.
(function () {
    const GITHUB_USER = 'A-S95';
    const POOL_SIZE = 8;
    const MOBILE_DEFAULT = 3;
    const list = document.querySelector('[data-github-commits]');
    if (!list) return;

    let commitPool = [];

    const timeAgo = (isoDate) => {
        const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
        const units = [
            ['year', 31536000],
            ['month', 2592000],
            ['day', 86400],
            ['hour', 3600],
            ['minute', 60],
        ];
        for (const [name, secondsInUnit] of units) {
            const value = Math.floor(seconds / secondsInUnit);
            if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
        }
        return 'just now';
    };

    const truncate = (text, max) => {
        const firstLine = text.split('\n')[0].trim();
        return firstLine.length > max ? firstLine.slice(0, max - 1) + '…' : firstLine;
    };

    const showStatus = (message) => {
        list.textContent = '';
        const li = document.createElement('li');
        li.className = 'github-commits-status';
        li.textContent = message;
        list.appendChild(li);
    };

    const buildCommitItem = (commit) => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.className = 'github-commit-item';
        link.href = `https://github.com/${commit.repoFullName}/commit/${commit.sha}`;
        link.target = '_blank';
        link.rel = 'noopener';

        const repoSpan = document.createElement('span');
        repoSpan.className = 'github-commit-repo';
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', 'git-commit-outline');
        repoSpan.appendChild(icon);
        repoSpan.appendChild(document.createTextNode(commit.repo));

        const messageSpan = document.createElement('span');
        messageSpan.className = 'github-commit-message';
        messageSpan.textContent = truncate(commit.message, 56);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'github-commit-time';
        timeSpan.textContent = timeAgo(commit.date);

        link.appendChild(repoSpan);
        link.appendChild(messageSpan);
        link.appendChild(timeSpan);
        li.appendChild(link);
        return li;
    };

    // Grows/shrinks the visible list to `count` items by only adding or removing
    // at the tail, instead of wiping and rebuilding everything — so commits
    // already on screen don't flicker, and newly added ones fade in on their own.
    const setVisibleCount = (count) => {
        const status = list.querySelector('.github-commits-status');
        if (status) status.remove();

        while (list.children.length > count) {
            list.lastElementChild.remove();
        }
        for (let i = list.children.length; i < count; i++) {
            const li = buildCommitItem(commitPool[i]);
            list.appendChild(li);
            const item = li.querySelector('.github-commit-item');
            setTimeout(() => item.classList.add('is-visible'), 20);
        }
    };

    // Measures a single commit row's height without touching the visible list
    // (an absolutely-positioned, invisible clone), so re-fitting never has to
    // flash the list down to 1 item first.
    const measureItemHeight = () => {
        const probe = buildCommitItem(commitPool[0]);
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.width = '100%';
        list.appendChild(probe);
        const height = probe.querySelector('.github-commit-item').getBoundingClientRect().height;
        probe.remove();
        return height;
    };

    // Shows as many commits from the pool as fit the space the flex layout gave
    // the list. On the two-column desktop layout that space depends on the
    // active page's content height, so this is re-run whenever that can change;
    // on narrower layouts (no height-matching happening) it just shows a fixed,
    // small count.
    const fitVisibleCommits = () => {
        if (commitPool.length === 0) return;

        if (!window.matchMedia('(min-width: 1250px)').matches) {
            setVisibleCount(Math.min(MOBILE_DEFAULT, commitPool.length));
            return;
        }

        const itemHeight = measureItemHeight();
        const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
        const available = list.clientHeight;
        const fit = Math.max(1, Math.floor((available + gap) / (itemHeight + gap)));

        setVisibleCount(Math.min(fit, commitPool.length));
    };

    let fitTimer;
    const scheduleFit = (delay) => {
        clearTimeout(fitTimer);
        fitTimer = setTimeout(fitVisibleCommits, delay);
    };

    window.addEventListener('resize', () => scheduleFit(200));

    // Web fonts make each commit row taller; a fit done before they load
    // would squeeze in one row too many, so re-fit once they're in
    if (document.fonts) document.fonts.ready.then(() => scheduleFit(0));

    // Switching page (About/Resume/...) swaps the content height immediately
    document.querySelectorAll('[data-nav-link]').forEach((btn) => {
        btn.addEventListener('click', () => scheduleFit(100));
    });

    // Expanding/collapsing a Resume entry animates its height via a CSS
    // transition on .job-details (see grid-template-rows); re-fit exactly when
    // that finishes rather than guessing a delay, with a fallback in case the
    // transition doesn't fire (e.g. reduced-motion).
    document.querySelectorAll('[data-job-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const details = btn.closest('[data-job]')?.querySelector('.job-details');
            if (!details) {
                scheduleFit(500);
                return;
            }
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                fitVisibleCommits();
            };
            details.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'grid-template-rows') finish();
            }, { once: true });
            setTimeout(finish, 600); // fallback if the transition never fires
        });
    });

    // Commit search returns repo, message and date in a single request (the
    // events feed needed one extra request per commit and quickly hit GitHub's
    // 60 requests/hour unauthenticated limit). Results are cached in
    // localStorage so reloads don't spend requests at all, and a stale cache
    // is still shown if GitHub is unavailable.
    const CACHE_KEY = 'github-commits';
    // The cached list is shown straight away and refreshed in the background;
    // this only stops quick reloads from calling GitHub again and again
    const REFRESH_AFTER = 60 * 1000;

    const readCache = () => {
        try {
            return JSON.parse(localStorage.getItem(CACHE_KEY));
        } catch {
            return null;
        }
    };

    const writeCache = (commits) => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), commits }));
        } catch {
            // Storage full or blocked — the widget still works, just without caching
        }
    };

    const showCommits = (commits) => {
        if (commits.length === 0) {
            showStatus('No recent public activity.');
            return;
        }
        // setVisibleCount only adds/removes rows at the end, so a new list
        // (not just a longer/shorter one) has to start from an empty widget
        const sameList = commits.length === commitPool.length
            && commits.every((c, i) => c.sha === commitPool[i].sha);
        if (!sameList) list.textContent = '';
        commitPool = commits;
        fitVisibleCommits();
    };

    const cached = readCache();
    const hasCache = cached && Array.isArray(cached.commits);
    if (hasCache) {
        showCommits(cached.commits);
        if (Date.now() - cached.savedAt < REFRESH_AFTER) return;
    }

    fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USER}&sort=author-date&order=desc&per_page=${POOL_SIZE}`)
        .then((res) => {
            if (!res.ok) throw new Error('GitHub API error');
            return res.json();
        })
        .then((data) => {
            const commits = data.items.map((item) => ({
                repo: item.repository.name,
                repoFullName: item.repository.full_name,
                sha: item.sha,
                message: item.commit.message || 'Update',
                date: item.commit.author.date,
            }));
            writeCache(commits);
            showCommits(commits);
        })
        .catch(() => {
            // With a cached list on screen, keep showing it
            if (!hasCache) showStatus("Couldn't load recent commits.");
        });
})();
