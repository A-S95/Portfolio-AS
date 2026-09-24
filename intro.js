'use strict';

// Intro screen: the animation itself is CSS (intro.css). This lets the visitor
// skip it, keeps the CAD coordinate readout in sync with the crosshair, and
// removes the intro once the two halves have opened.
(function () {
    const root = document.documentElement;
    const intro = document.querySelector('[data-intro]');
    if (!intro) return;

    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        intro.remove();
        root.classList.remove('intro-active', 'intro-dark');
        root.style.removeProperty('--intro-scale');
    };

    // Not playing this visit, or motion is reduced (the intro is all motion)
    if (!root.classList.contains('intro-active')
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finish();
        return;
    }

    try {
        sessionStorage.setItem('intro-seen', '1');
    } catch {
        // Storage blocked — the intro just shows again next time
    }

    // Live "X / Y" readout in cm, following the crosshair across the board
    // (the board is 480 × 300 units, 1 unit = 1 cm)
    const cross = intro.querySelector('[data-intro-cross]');
    const coords = intro.querySelector('[data-intro-coords]');
    const board = cross && cross.parentElement;
    const tick = () => {
        if (done) return;
        const unit = board.offsetWidth / 480;
        if (unit > 0) {
            // offsetLeft/Top include the -4px margin that centres the crosshair
            const x = (cross.offsetLeft + 4) / unit;
            const y = 300 - (cross.offsetTop + 4) / unit;
            coords.textContent = `X ${x.toFixed(1)} · Y ${y.toFixed(1)}`;
        }
        requestAnimationFrame(tick);
    };
    if (cross && coords) requestAnimationFrame(tick);

    const leave = () => intro.classList.add('is-leaving');

    intro.querySelector('.intro-half--left').addEventListener('animationend', (e) => {
        if (e.animationName === 'introOpenLeft') finish();
    });

    intro.addEventListener('click', leave);
    document.addEventListener('keydown', function onKey() {
        leave();
        document.removeEventListener('keydown', onKey);
    });

    // Safety net in case an animation event never fires
    setTimeout(finish, 6500);
})();
