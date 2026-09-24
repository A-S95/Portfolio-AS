'use strict';

// Workshop — a bench behind the portfolio. Kitchen modules and cassettes are
// scattered around (in the side gutters on wide screens); dragging a module, or
// the Workshop button, slides the portfolio away and reveals a kitchen wall to
// assemble. The radio plays the cassettes through Spotify's embed; on wide
// screens it sits in the right gutter, so music can play while browsing.

// My top 10 — paste each song's Spotify link id (open.spotify.com/track/<id>)
const TOP_TRACKS = [
    { title: 'Dream big', artist: 'STOSLIV, LOVIXX', spotifyId: '5dl8A0NebyFOwLwvt33lkP' },
    { title: 'Millioniere (Afrobeat)', artist: 'LOVIXX', spotifyId: '0ZhNyfcIw6hCdmXNbnpLO9' },
    { title: 'I Rise', artist: 'LOVIXX', spotifyId: '0ev307uwrW5pY7CfaE4ur1' },
    { title: 'Try again', artist: 'IRIAS, LOVIXX', spotifyId: '0Ip3BIyeIY2T5rCXXiFNiw' },
    { title: 'Ghost Ride', artist: 'FRHAD', spotifyId: '2tQNsUlhPA9wY5O3H7aFEJ' },
    { title: 'Toca Toca', artist: 'Albè', spotifyId: '0aXnla7fbwqK0SlHaeXBG6' },
    { title: 'all my mistakes', artist: 'skaviński', spotifyId: '1jkAfdIH4kVpm3lkqtYicb' },
    { title: 'Nadie Pregunto Por Mi', artist: 'Vidal Lara', spotifyId: '23p6Qx45jiHbaOdJpDcUVy' },
    { title: 'Partimento', artist: 'Supa Squad', spotifyId: '2YEA1CW7n1Aa60AU2Vp9gM' },
    { title: 'Black Betty', artist: 'Ram Jam', spotifyId: '6kooDsorCpWVMGc994XjWN' },
];

(function () {
    const stage = document.querySelector('[data-workshop]');
    const layer = document.querySelector('[data-workshop-pieces]');
    if (!stage || !layer) return;

    const fab = document.querySelector('[data-workshop-toggle]');
    const fabLabel = document.querySelector('[data-workshop-toggle-label]');
    const closeBtn = stage.querySelector('[data-workshop-close]');
    const resetBtn = stage.querySelector('[data-workshop-reset]');
    const spacer = stage.querySelector('[data-radio-spacer]');
    const wall = stage.querySelector('[data-wall]');
    const bench = stage.querySelector('[data-bench]');
    // The radio lives outside the stage: moving the Spotify iframe around the
    // DOM would reload it and cut the music
    const radio = document.querySelector('[data-radio]');
    const deck = document.querySelector('[data-radio-deck]');
    const display = document.querySelector('[data-radio-display]');
    const player = document.querySelector('[data-radio-player]');
    const ejectBtn = document.querySelector('[data-radio-eject]');

    // Spotify's compact player gets scrollbars below 300px wide, so in a
    // narrower slot (the gutter on 1920px screens, small phones) it's rendered
    // at 300px and scaled down to fit
    const PLAYER_MIN_WIDTH = 300;
    const fitPlayer = () => {
        const w = player.clientWidth;
        const scale = w && w < PLAYER_MIN_WIDTH ? (w / PLAYER_MIN_WIDTH).toFixed(3) : '1';
        if (player.style.getPropertyValue('--player-scale') !== scale) {
            player.style.setProperty('--player-scale', scale);
        }
    };
    const toast = stage.querySelector('[data-workshop-toast]');
    const rows = {
        wall: stage.querySelector('[data-row="wall"]'),
        base: stage.querySelector('[data-row="base"]'),
    };

    const SLOTS_PER_ROW = 6;
    const STORAGE_KEY = 'workshop-v1';
    // Wide enough for pieces to live in the gutters beside the page
    const wideMq = window.matchMedia('(min-width: 1500px)');

    // ---- Kitchen modules (front elevations, 60 cm wide) --------------------

    const frame = (h) => `<rect class="ws-body" x="1" y="1" width="58" height="${h - 2}" rx="2"/>`;
    const handleV = (x, y) => `<line class="ws-handle" x1="${x}" y1="${y}" x2="${x}" y2="${y + 10}"/>`;
    const handleH = (x, y, w = 14) => `<line class="ws-handle" x1="${x}" y1="${y}" x2="${x + w}" y2="${y}"/>`;

    const MODULE_SVG = {
        sink: `${frame(81)}
            <path class="ws-detail" d="M12 6 q18 10 36 0"/>
            <rect class="ws-door" x="4" y="14" width="25" height="63" rx="1"/>
            <rect class="ws-door" x="31" y="14" width="25" height="63" rx="1"/>
            ${handleV(25, 20)}${handleV(35, 20)}`,
        oven: `${frame(81)}
            <rect class="ws-door" x="4" y="4" width="52" height="11" rx="1"/>
            <circle class="ws-detail" cx="14" cy="9.5" r="2.5"/><circle class="ws-detail" cx="22" cy="9.5" r="2.5"/>
            <rect class="ws-detail" x="36" y="7" width="14" height="5" rx="1"/>
            ${handleH(12, 21, 36)}
            <rect class="ws-glass" x="8" y="26" width="44" height="34" rx="3"/>
            <rect class="ws-door" x="4" y="64" width="52" height="13" rx="1"/>${handleH(23, 70)}`,
        dishwasher: `${frame(81)}
            <rect class="ws-door" x="4" y="4" width="52" height="9" rx="1"/>
            <rect class="ws-detail" x="40" y="6.5" width="10" height="4" rx="1"/>
            <rect class="ws-door" x="4" y="15" width="52" height="62" rx="1"/>${handleH(20, 21, 20)}`,
        drawers: `${frame(81)}
            <rect class="ws-door" x="4" y="4" width="52" height="18" rx="1"/>${handleH(23, 10)}
            <rect class="ws-door" x="4" y="25" width="52" height="24" rx="1"/>${handleH(23, 32)}
            <rect class="ws-door" x="4" y="52" width="52" height="25" rx="1"/>${handleH(23, 59)}`,
        cabinet: `${frame(81)}
            <rect class="ws-door" x="4" y="4" width="52" height="73" rx="1"/>${handleV(50, 8)}`,
        wallCabinet: `${frame(60)}
            <rect class="ws-door" x="4" y="4" width="52" height="52" rx="1"/>${handleV(50, 42)}`,
        glassCabinet: `${frame(60)}
            <rect class="ws-door" x="4" y="4" width="52" height="52" rx="1"/>
            <rect class="ws-glass ws-glass--light" x="9" y="9" width="42" height="42" rx="1"/>
            <line class="ws-detail" x1="30" y1="9" x2="30" y2="51"/><line class="ws-detail" x1="9" y1="30" x2="51" y2="30"/>
            ${handleV(50, 42)}`,
        hood: `<rect class="ws-body" x="21" y="1" width="18" height="30" rx="1"/>
            <path class="ws-body" d="M6 31 H54 L58 50 H2 Z"/>
            <rect class="ws-body" x="2" y="50" width="56" height="6" rx="1"/>
            <line class="ws-detail" x1="10" y1="53" x2="50" y2="53"/>`,
    };

    const MODULES = [
        { id: 'sink', row: 'base', svg: 'sink', label: 'Sink unit' },
        { id: 'oven', row: 'base', svg: 'oven', label: 'Oven' },
        { id: 'dishwasher', row: 'base', svg: 'dishwasher', label: 'Dishwasher' },
        { id: 'drawers', row: 'base', svg: 'drawers', label: 'Drawer unit' },
        { id: 'cabinet-1', row: 'base', svg: 'cabinet', label: 'Base cabinet' },
        { id: 'cabinet-2', row: 'base', svg: 'cabinet', label: 'Base cabinet' },
        { id: 'hood', row: 'wall', svg: 'hood', label: 'Cooker hood' },
        { id: 'wall-1', row: 'wall', svg: 'wallCabinet', label: 'Wall cabinet' },
        { id: 'wall-2', row: 'wall', svg: 'wallCabinet', label: 'Wall cabinet' },
        { id: 'glass', row: 'wall', svg: 'glassCabinet', label: 'Glass wall cabinet' },
    ];

    const TAPE_COLORS = ['#e76f51', '#f4a261', '#2a9d8f', '#e9c46a', '#8ab17d',
        '#6d597a', '#d62828', '#457b9d', '#b5838d', '#3d405b'];

    const CASSETTE_SVG = `
        <rect class="ws-tape-shell" x="1" y="1" width="98" height="61" rx="5"/>
        <rect class="ws-tape-label" x="7" y="5" width="86" height="29" rx="2"/>
        <rect class="ws-tape-window" x="27" y="37" width="46" height="15" rx="7.5"/>
        <g class="ws-reel"><circle cx="38" cy="44.5" r="5"/><path d="M38 40.5v8M34 44.5h8"/></g>
        <g class="ws-reel"><circle cx="62" cy="44.5" r="5"/><path d="M62 40.5v8M58 44.5h8"/></g>
        <path class="ws-tape-bottom" d="M22 62 L26 55 H74 L78 62"/>
        <circle class="ws-screw" cx="5" cy="5" r="1.4"/><circle class="ws-screw" cx="95" cy="5" r="1.4"/>
        <circle class="ws-screw" cx="5" cy="58" r="1.4"/><circle class="ws-screw" cx="95" cy="58" r="1.4"/>`;

    // ---- State --------------------------------------------------------------

    const pieces = [];
    const byId = {};
    let isOpen = false;
    let topZ = 1;
    let tapeInRadio = null;
    let kitchenDone = false;
    let hoodDone = false;

    // Small deterministic PRNG so each piece keeps the same "messy" spot and
    // tilt between visits until someone actually moves it
    const seeded = (str, n) => {
        let h = 2166136261;
        for (const c of str + n) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
        return ((h >>> 0) % 10000) / 10000;
    };

    const loadState = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    };

    const saveState = () => {
        const state = {};
        pieces.forEach((p) => {
            if (p.slot !== null) state[p.id] = { slot: p.slot };
            else if (p.moved) state[p.id] = p.moved;
        });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Storage blocked — the workshop still works, it just won't remember
        }
    };

    // ---- Build --------------------------------------------------------------

    Object.entries(rows).forEach(([row, el]) => {
        for (let i = 0; i < SLOTS_PER_ROW; i++) {
            const slot = document.createElement('div');
            slot.className = 'ws-slot';
            slot.dataset.index = i;
            el.appendChild(slot);
        }
    });

    const addPiece = (piece, el) => {
        el.classList.add('ws-piece');
        el.dataset.id = piece.id;
        el.tabIndex = -1;
        el.style.setProperty('--rot', `${(seeded(piece.id, 'r') - 0.5) * (piece.kind === 'tape' ? 18 : 12)}deg`);
        layer.appendChild(el);
        Object.assign(piece, { el, slot: null, moved: null });
        pieces.push(piece);
        byId[piece.id] = piece;
    };

    MODULES.forEach((m) => {
        const el = document.createElement('div');
        el.className = `ws-module ws-module--${m.row}`;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', m.label);
        el.title = m.label;
        const height = m.row === 'base' ? 81 : 60;
        el.innerHTML = `<svg viewBox="0 0 60 ${height}" aria-hidden="true">${MODULE_SVG[m.svg]}</svg>`;
        addPiece({ id: m.id, kind: 'module', row: m.row, label: m.label }, el);
    });

    TOP_TRACKS.forEach((track, i) => {
        const el = document.createElement('div');
        el.className = 'ws-cassette';
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Cassette: ${track.title} by ${track.artist}`);
        el.style.setProperty('--tape', TAPE_COLORS[i % TAPE_COLORS.length]);
        el.innerHTML = `<svg viewBox="0 0 100 63" aria-hidden="true">${CASSETTE_SVG}</svg>
            <span class="ws-cassette-label">
                <span class="ws-cassette-side">A${i + 1}</span>
                <strong></strong><small></small>
            </span>`;
        el.querySelector('strong').textContent = track.title;
        el.querySelector('small').textContent = track.artist;
        addPiece({ id: `tape-${i + 1}`, kind: 'tape', track }, el);
    });

    const saved = loadState();
    Object.entries(saved).forEach(([id, value]) => {
        const p = byId[id];
        if (!p || !value) return;
        if (typeof value.slot === 'number' && p.kind === 'module') p.slot = value.slot;
        else if (typeof value.fx === 'number') p.moved = value;
    });

    // ---- Positioning ----------------------------------------------------------

    const viewport = () => ({ w: document.documentElement.clientWidth, h: window.innerHeight });

    const slotEl = (p) => rows[p.row].children[p.slot];

    // Where untouched pieces lie: the gutters on wide screens, the bench otherwise
    const homeZone = (p) => {
        const { w, h } = viewport();
        if (wideMq.matches) {
            // The page width grows with the screen, so measure the gutters from
            // it (offset* values ignore the scale-down while the workshop is open)
            const page = document.querySelector('main');
            const left = page.offsetLeft;
            const right = w - (page.offsetLeft + page.offsetWidth);
            if (p.kind === 'module') return { x: 16, y: 80, w: left - 32, h: h - 160 };
            // Cassettes lie in the right gutter, above the radio
            const radioTop = radio.getBoundingClientRect().top;
            return { x: w - right + 16, y: 40, w: right - 32, h: Math.max(radioTop - 60, 120) };
        }
        const b = bench.getBoundingClientRect();
        const half = b.width / 2;
        return {
            x: b.left + (p.kind === 'module' ? 8 : half + 8),
            y: b.top + 10,
            w: half - 16,
            h: b.height - 20,
        };
    };

    const setPos = (p, x, y) => {
        p.el.style.left = `${Math.round(x)}px`;
        p.el.style.top = `${Math.round(y)}px`;
    };

    const place = (p) => {
        const { el } = p;
        const pw = el.offsetWidth;
        const ph = el.offsetHeight;
        el.classList.toggle('is-snapped', p.slot !== null);
        el.classList.toggle('in-radio', p === tapeInRadio);

        if (p === tapeInRadio) {
            const r = deck.getBoundingClientRect();
            setPos(p, r.left + (r.width - pw) / 2, r.top + (r.height - ph) / 2);
        } else if (p.slot !== null) {
            const r = slotEl(p).getBoundingClientRect();
            setPos(p, r.left, r.bottom - ph);
        } else if (p.moved) {
            const { w, h } = viewport();
            setPos(p,
                Math.min(Math.max(p.moved.fx * w, 0), w - pw),
                Math.min(Math.max(p.moved.fy * h, 0), h - ph));
        } else {
            const z = homeZone(p);
            setPos(p,
                z.x + seeded(p.id, 'x') * Math.max(z.w - pw, 0),
                z.y + seeded(p.id, 'y') * Math.max(z.h - ph, 0));
        }
    };

    const placeAll = () => pieces.forEach(place);

    // ---- Kitchen --------------------------------------------------------------

    const occupant = (row, slot) => pieces.find((p) => p.row === row && p.slot === slot);

    const showToast = (message) => {
        toast.textContent = message;
        toast.hidden = false;
        toast.classList.remove('is-visible');
        void toast.offsetWidth;
        toast.classList.add('is-visible');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 4200);
    };

    const checkKitchen = (announce) => {
        const base = pieces.filter((p) => p.row === 'base' && p.slot !== null);
        const complete = base.length === SLOTS_PER_ROW
            && byId.sink.slot !== null && byId.oven.slot !== null;
        const hoodOk = byId.hood.slot !== null && byId.hood.slot === byId.oven.slot;

        wall.classList.toggle('is-complete', complete);
        resetBtn.hidden = !pieces.some((p) => p.slot !== null);
        if (announce && complete && !kitchenDone) {
            showToast('Kitchen assembled. Measure twice, cut once.');
        } else if (announce && hoodOk && !hoodDone) {
            showToast('Hood right above the oven. Spoken like a kitchen designer.');
        }
        kitchenDone = complete;
        hoodDone = hoodOk;
    };

    // Snap a module to the free slot of its row nearest to x (or the first free one)
    const snapModule = (p, x) => {
        const free = [...rows[p.row].children]
            .map((el, i) => ({ i, el }))
            .filter(({ i }) => !occupant(p.row, i));
        if (!free.length) return false;
        const target = x === undefined
            ? free[0]
            : free.reduce((best, s) => {
                const r = s.el.getBoundingClientRect();
                const d = Math.abs(r.left + r.width / 2 - x);
                return d < best.d ? { ...s, d } : best;
            }, { d: Infinity });
        p.slot = target.i;
        p.moved = null;
        return true;
    };

    // ---- Radio ----------------------------------------------------------------

    const setDisplay = (text) => {
        display.textContent = text;
    };

    const insertTape = (p) => {
        if (tapeInRadio && tapeInRadio !== p) ejectTape(false);
        tapeInRadio = p;
        p.moved = null;
        radio.classList.add('has-tape');
        ejectBtn.disabled = false;
        setDisplay(`▶ ${p.track.title} — ${p.track.artist}`);

        player.textContent = '';
        if (p.track.spotifyId) {
            const frame = document.createElement('iframe');
            // Spotify has no light player: dark mode gets its dark theme,
            // light mode the default one, tinted from the cover art
            const darkPlayer = document.body.classList.contains('dark-mode') ? '&theme=0' : '';
            frame.src = `https://open.spotify.com/embed/track/${encodeURIComponent(p.track.spotifyId)}?utm_source=generator${darkPlayer}`;
            frame.title = `${p.track.title} by ${p.track.artist} on Spotify`;
            frame.loading = 'lazy';
            frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            player.appendChild(frame);
        } else {
            const note = document.createElement('p');
            note.className = 'ws-radio-note';
            note.textContent = 'This tape is still being recorded. Check back soon!';
            player.appendChild(note);
        }
        player.hidden = false;
        fitPlayer();
    };

    const ejectTape = (replace = true) => {
        const p = tapeInRadio;
        if (!p) return;
        tapeInRadio = null;
        radio.classList.remove('has-tape');
        ejectBtn.disabled = true;
        setDisplay('Insert tape');
        player.textContent = '';
        player.hidden = true;
        // Pops out just above the radio
        const r = radio.getBoundingClientRect();
        const { w, h } = viewport();
        p.moved = {
            fx: (r.left + r.width / 2 - p.el.offsetWidth / 2 + (seeded(p.id, 'e') - 0.5) * 80) / w,
            fy: Math.max(r.top - p.el.offsetHeight - 12, 60) / h,
        };
        if (replace) placeAll();
    };

    ejectBtn.addEventListener('click', () => {
        ejectTape();
        saveState();
    });

    // Take the kitchen apart: every module goes back to where it started
    resetBtn.addEventListener('click', () => {
        pieces.forEach((p) => {
            if (p.kind === 'module') {
                p.slot = null;
                p.moved = null;
            }
        });
        placeAll();
        checkKitchen(false);
        saveState();
    });

    // ---- Open / close -----------------------------------------------------------

    const setOpen = (open) => {
        if (open === isOpen) return;
        isOpen = open;
        document.body.classList.toggle('workshop-open', open);
        document.documentElement.classList.toggle('workshop-lock', open);
        stage.setAttribute('aria-hidden', String(!open));
        layer.setAttribute('aria-hidden', String(!open));
        fab.setAttribute('aria-pressed', String(open));
        fabLabel.textContent = open ? 'Back to portfolio' : 'Workshop';
        pieces.forEach((p) => { p.el.tabIndex = open ? 0 : -1; });
        placeAll();
    };

    fab.addEventListener('click', () => setOpen(!isOpen));
    closeBtn.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) setOpen(false);
    });

    // ---- Dragging ---------------------------------------------------------------

    const inside = (r, x, y, pad = 0) =>
        x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;

    // A tap (or Enter) does the obvious thing: a cassette goes into the radio,
    // a module goes into the next free slot of its row
    const quickPlace = (p) => {
        if (p.kind === 'tape') {
            if (p === tapeInRadio) ejectTape(false);
            else insertTape(p);
        } else if (p.slot === null) {
            snapModule(p);
        }
        placeAll();
        checkKitchen(true);
        saveState();
    };

    const drop = (p, cx, cy) => {
        if (p.kind === 'tape') {
            if (inside(radio.getBoundingClientRect(), cx, cy, 10)) {
                insertTape(p);
                return;
            }
        } else {
            const rowRect = rows[p.row].getBoundingClientRect();
            const m = p.el.offsetWidth;
            if (inside(wall.getBoundingClientRect(), cx, cy, m / 2)
                && cy > rowRect.top - m * 0.6 && cy < rowRect.bottom + m * 0.6
                && snapModule(p, cx)) return;
        }
        const r = p.el.getBoundingClientRect();
        const { w, h } = viewport();
        p.moved = { fx: r.left / w, fy: r.top / h };
    };

    layer.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('.ws-piece');
        if (!el || e.button !== 0) return;
        const p = byId[el.dataset.id];
        e.preventDefault();

        // Modules need the wall, so they open the workshop; on wide screens the
        // radio is already beside the portfolio, so cassettes just get played
        if (!isOpen && !(p.kind === 'tape' && wideMq.matches)) setOpen(true);

        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const startX = e.clientX;
        const startY = e.clientY;
        let dragged = false;

        el.style.zIndex = ++topZ;
        el.setPointerCapture(e.pointerId);

        const onMove = (ev) => {
            if (!dragged && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
            if (!dragged) {
                dragged = true;
                // Lifting a piece off the wall or out of the radio frees its spot
                if (p === tapeInRadio) ejectTape(false);
                p.slot = null;
                el.classList.add('is-dragging');
                el.classList.remove('is-snapped', 'in-radio');
                checkKitchen(false);
            }
            setPos(p, ev.clientX - offsetX, ev.clientY - offsetY);
            if (p.kind === 'tape') {
                radio.classList.toggle('is-target', inside(radio.getBoundingClientRect(), ev.clientX, ev.clientY, 10));
            }
        };

        const onUp = (ev) => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onUp);
            radio.classList.remove('is-target');
            el.classList.remove('is-dragging');

            if (!dragged) {
                quickPlace(p);
                return;
            }
            const r = el.getBoundingClientRect();
            drop(p, r.left + r.width / 2, r.top + r.height / 2);
            placeAll();
            checkKitchen(true);
            saveState();
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
    });

    layer.addEventListener('keydown', (e) => {
        const el = e.target.closest('.ws-piece');
        if (!el || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        quickPlace(byId[el.dataset.id]);
    });

    // ---- Layout upkeep ------------------------------------------------------------

    // Phones/tablets: the radio sits on the bench, over a spacer in the stage
    // that keeps the wall from running into it. Wide screens: CSS docks it in
    // the right gutter instead.
    const radioDock = document.querySelector('[data-radio-dock]');
    const syncRadioDock = () => {
        if (wideMq.matches) {
            spacer.style.height = '0px';
            radioDock.style.top = '';
            return;
        }
        spacer.style.height = `${radio.offsetHeight}px`;
        radioDock.style.top = `${spacer.getBoundingClientRect().top}px`;
    };

    // The wall/radio/bench move when the viewport or the radio (player shown or
    // not) changes size, and snapped pieces have to follow them
    let rafId;
    const schedulePlace = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            fitPlayer();
            syncRadioDock();
            placeAll();
        });
    };
    window.addEventListener('resize', schedulePlace);
    wideMq.addEventListener('change', schedulePlace);
    if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(schedulePlace);
        [stage, radio, wall, bench].forEach((el) => ro.observe(el));
    }

    syncRadioDock();
    placeAll();
    checkKitchen(false);
    // Pieces fade in once they're in place (no flying in from the top-left corner)
    requestAnimationFrame(() => layer.classList.add('is-ready'));
})();
