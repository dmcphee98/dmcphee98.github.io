// Generates a random single-line mountain range as SVG path strings, in a 1200×160 viewBox.
// Returns the ridge, the contour strokes left to right, and the pines, each split into two halves
// that draw together from the ground up.

type Pt = [number, number];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

// Pines relative to their apex: the right half of the foliage, from the centre of its base up to the apex
// (the left half mirrors it), and the trunk length below the base when the pine stands on flat ground
const PINES = [
    { half: [[0, 30], [13, 30], [6, 20], [10, 20], [3, 10], [6, 10], [0, 0]] as Pt[], trunk: 6, x: 1148 },
    { half: [[0, 16], [8, 16], [2, 8], [5, 8], [0, 0]] as Pt[], trunk: 8, x: 1176 },
];
// Pines sit near the right edge, where the ridge flattens out onto the baseline; this jitter keeps them apart
const PINE_JITTER = 3;
// How far the foliage stays above the ridge at its closest; the trunk stretches to meet the ground
const PINE_CLEARANCE = 3;

const toPath = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${Math.round(x)} ${Math.round(y)}`).join(" ");

function ridgeYAt(ridge: Pt[], x: number) {
    for (let i = 1; i < ridge.length; i++) {
        const [x0, y0] = ridge[i - 1];
        const [x1, y1] = ridge[i];
        if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return ridge[ridge.length - 1][1];
}

// Highest point (smallest y) of the ridge between x0 and x1
function ridgeTopBetween(ridge: Pt[], x0: number, x1: number) {
    const inside = ridge.filter(([x]) => x > x0 && x < x1).map(([, y]) => y);
    return Math.min(ridgeYAt(ridge, x0), ridgeYAt(ridge, x1), ...inside);
}

type Seg = [Pt, Pt];

const segmentsOf = (pts: Pt[]): Seg[] => pts.slice(1).map((p, i) => [pts[i], p]);

// Proper crossing only: segments that merely share an endpoint (strokes leaving the same peak) don't count
function crosses([a, b]: Seg, [c, d]: Seg) {
    const side = (o: Pt, p: Pt, q: Pt) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
    return side(c, d, a) * side(c, d, b) < 0 && side(a, b, c) * side(a, b, d) < 0;
}

function distToSeg([px, py]: Pt, [[ax, ay], [bx, by]]: Seg) {
    const lenSq = (bx - ax) ** 2 + (by - ay) ** 2;
    const t = lenSq ? Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / lenSq)) : 0;
    return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)));
}

const normalize = ([x, y]: Pt): Pt => {
    const len = Math.hypot(x, y);
    return [x / len, y / len];
};

// Direction for a face's detail lines: part-way (t) between the ridge edge they follow and straight down,
// so they run with the face instead of hugging the skyline or fanning out sideways
function faceDirection([px, py]: Pt, edgeEnd: Pt, t: number): Pt {
    const [ex, ey] = normalize([edgeEnd[0] - px, edgeEnd[1] - py]);
    return normalize([ex * (1 - t), ey * (1 - t) + t]);
}

// A detail line descending `drop` units from `start` along `dir`: long runs separated by short sideways kinks
// (about 3:1), every point lower than the last. Kinks alternate, starting back toward the peak's centre.
function detailLine(start: Pt, [dx, dy]: Pt, drop: number, runs: number, side: number): Pt[] {
    const weights = Array.from({ length: runs }, (_, i) => (1 - i * 0.3) * rand(0.85, 1.15));
    const total = weights.reduce((a, b) => a + b, 0);
    // At least 2 units so rounding can't flatten a kink and break the always-descending rule
    const kinkDrop = runs > 1 ? Math.max(2, (drop * 0.15) / (runs - 1)) : 0;
    const pts: Pt[] = [start];
    weights.forEach((w, i) => {
        const [x, y] = pts[pts.length - 1];
        const runLen = (drop * (runs > 1 ? 0.85 : 1) * (w / total)) / dy;
        const [rx, ry] = [x + dx * runLen, y + dy * runLen];
        pts.push([rx, ry]);
        if (i < runs - 1) {
            const kinkDir = i % 2 === 0 ? -side : side;
            pts.push([rx + kinkDir * runLen * rand(0.25, 0.4), ry + kinkDrop]);
        }
    });
    return pts.map(([x, y]) => [Math.round(x), Math.round(y)]);
}

// Height of a massif's flanks where they meet the valleys
const MASSIF_FOOT = 126;
// Both ends of the ridge finish on this line
const BASELINE = 150;

// fBm detail on top of the massifs, one layer per octave. Tune each layer here:
//   frequency — bumps across the full 1200-unit width (higher = narrower, busier crests)
//   amplitude — peak-to-trough height in viewBox units, before the whole range is rescaled to fit,
//               so what matters is each layer's size relative to the others and to the massifs (30–75)
// Real topography profiles have a power spectrum falling roughly as 1/f² or steeper (Hurst exponent ~0.5–0.8),
// i.e. each doubling of frequency keeps ~0.57–0.71 of the amplitude; the defaults use 0.6.
const OCTAVES = [
    { frequency: 8,  amplitude: 0 },
    { frequency: 16, amplitude: 0 },
    { frequency: 32, amplitude: 100 },
    { frequency: 64, amplitude: 20 },
];
// Ridge sample spacing, and how far the sampled profile may stray from the simplified facets
const SAMPLE_STEP = 3;
const FACET_TOLERANCE = 3;

// One octave of 1D ridged value noise (after Musgrave): smooth random values folded with 1 − |n|,
// so zero crossings become sharp crests and the rest broad, rounded dips. Returns 0–1.
function ridgedOctave(wavelength: number) {
    const offset = rand(0, 1000);
    const lattice = new Map<number, number>();
    const valueAt = (i: number) => {
        if (!lattice.has(i)) lattice.set(i, rand(-1, 1));
        return lattice.get(i)!;
    };
    return (x: number) => {
        const u = (x + offset) / wavelength;
        const i = Math.floor(u);
        const f = u - i;
        const s = f * f * (3 - 2 * f);
        return 1 - Math.abs(valueAt(i) * (1 - s) + valueAt(i + 1) * s);
    };
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

// Ramer–Douglas–Peucker: reduces a sampled profile to straight facets, keeping every bend that strays more
// than FACET_TOLERANCE from a straight line, so shoulders and notches on the flanks survive as well as crests
function facets(samples: Pt[]): Pt[] {
    const [first, last] = [samples[0], samples[samples.length - 1]];
    let worst = 0;
    let worstIndex = 0;
    for (let i = 1; i < samples.length - 1; i++) {
        const d = distToSeg(samples[i], [first, last]);
        if (d > worst) [worst, worstIndex] = [d, i];
    }
    if (worst <= FACET_TOLERANCE) return [first, last];
    return [...facets(samples.slice(0, worstIndex + 1)).slice(0, -1), ...facets(samples.slice(worstIndex))];
}
// Shortest and longest a detail line may be, as a fraction of the way from its start down to the baseline
const MIN_REACH = 0.7;
const MAX_REACH = 0.9;

export type MountainRange = { ridge: string; strokes: string[]; pines: [string, string][] };

export function generateMountainRange(): MountainRange {
    // First order: 3–4 massifs across 110–1050, each narrower than its slot so clear valleys separate them.
    // The right end beyond 1050 stays a gentle slope for the pines.
    const massifCount = randInt(3, 4);
    const slot = (1050 - 110) / massifCount;
    const massifs = Array.from({ length: massifCount }, (_, i) => {
        const outer = i === 0 || i === massifCount - 1;
        return {
            centre: 110 + slot * (i + 0.5) + rand(-0.08, 0.08) * slot,
            halfWidth: slot * 0.5 * rand(0.7, 0.85),
            // Envelope height above the valley floor; outer massifs sit lower so the range fades into foothills
            height: outer && massifCount > 3 ? rand(30, 50) : rand(50, 75),
        };
    });
    const tallest = Math.max(...massifs.map(m => m.height));

    // Height above the baseline at x: valley floor + massif envelope + ridged fBm, tapered to zero at both ends
    const valleyFloor = BASELINE - MASSIF_FOOT;
    const envelope = (x: number) => Math.max(0, ...massifs.map(({ centre, halfWidth, height }) =>
        // Slightly concave flanks, as real mountain sides steepen toward the top
        height * Math.max(0, 1 - Math.abs(x - centre) / halfWidth) ** 1.2));
    const octaves = OCTAVES.map(({ frequency, amplitude }) => ({
        noise: ridgedOctave(1200 / frequency),
        amplitude,
    }));
    const heightAt = (x: number) => {
        const e = envelope(x);
        // Ridged octaves only add height, building crests on the envelope rather than cancelling summits out
        const detail = octaves.reduce((sum, { noise, amplitude }) => sum + amplitude * noise(x), 0);
        // Detail is strongest on the massifs and calmer in the valleys, so the gaps between them stay readable
        const h = valleyFloor + e + detail * (0.35 + 0.65 * (e / tallest));
        return h * smoothstep(0, 100, x) * smoothstep(1200, 1070, x);
    };

    const heights: Pt[] = [];
    for (let x = 0; x <= 1200; x += SAMPLE_STEP) heights.push([x, heightAt(x)]);
    // Rescale so the highest point lands at y 10–35: never flat, never clipped at the top. Scaling heights
    // keeps both ends on the baseline and preserves every octave's ratio.
    const scale = (BASELINE - rand(10, 35)) / Math.max(...heights.map(([, h]) => h));
    const samples: Pt[] = heights.map(([x, h]) => [x, BASELINE - h * scale]);
    // Snap to whole units now, so the collision checks below test exactly what gets drawn
    const ridge: Pt[] = facets(samples).map(([x, y]) => [Math.round(x), Math.round(y)]);

    // Crests on each massif; the highest is its summit. rel is a peak's height within its massif:
    // 1 at the summit, 0 at the foot. Crests out in the valleys belong to no massif and get no detail.
    const peaks: { pt: Pt; massif: number; summit: boolean; rel: number }[] = [];
    massifs.forEach(({ centre, halfWidth }, m) => {
        const crests = ridge.filter((p, i) => i > 0 && i < ridge.length - 1
            && p[1] < ridge[i - 1][1] && p[1] < ridge[i + 1][1] && Math.abs(p[0] - centre) < halfWidth);
        if (!crests.length) return;
        const top = crests.reduce((a, b) => (b[1] < a[1] ? b : a));
        for (const pt of crests) {
            peaks.push({ pt, massif: m, summit: pt === top, rel: (MASSIF_FOOT - pt[1]) / Math.max(1, MASSIF_FOOT - top[1]) });
        }
    });

    const ridgeSegs = segmentsOf(ridge);
    const lineSegs: Seg[] = [];
    const lines: Pt[][] = [];

    // A line is kept only if it stays in open space: inside the art, always descending, crossing nothing,
    // and at least 5 units clear of the ridge and of every other line along its whole length
    const tryAdd = (pts: Pt[]) => {
        const segs = segmentsOf(pts);
        // Checked on the rounded points, so the drawn line really ends within 70–90% of the way to the baseline
        const reach = (pts[pts.length - 1][1] - pts[0][1]) / (BASELINE - pts[0][1]);
        const fits = reach >= MIN_REACH && reach <= MAX_REACH
            && pts.every(([x, y]) => x > 5 && x < 1090 && y <= 146)
            && pts.every((p, i) => i === 0 || p[1] > pts[i - 1][1])
            && segs.every(seg => !ridgeSegs.some(r => crosses(seg, r)) && !lineSegs.some(o => crosses(seg, o)))
            && pts.slice(1).every(p => ridgeSegs.every(r => distToSeg(p, r) >= 5) && lineSegs.every(o => distToSeg(p, o) >= 5))
            && lineSegs.every(o => o.every(p => segs.every(seg => distToSeg(p, seg) >= 5)));
        if (fits) {
            lineSegs.push(...segs);
            lines.push(pts);
        }
        return fits;
    };

    // One light direction for the whole range: every line sits on the same face of its peak
    const side = Math.random() < 0.5 ? 1 : -1;
    const perMassif = massifs.map(() => 0);
    // Summits claim their space first, then the mid-height sub-peaks; low flank peaks get nothing
    const ordered = [...peaks].sort((a, b) => Number(b.summit) - Number(a.summit) || b.rel - a.rel);
    for (const { pt, massif, summit, rel } of ordered) {
        if (perMassif[massif] >= 4 || (!summit && rel < 0.55)) continue;
        const [px, py] = [Math.round(pt[0]), Math.round(pt[1])];
        const vertex = ridge.findIndex(([x, y]) => x === px && y === py);
        if (vertex < 1 || vertex >= ridge.length - 1) continue;
        const { centre, halfWidth } = massifs[massif];
        // Summit lines follow the massif's whole flank on the shadow side; sub-peak lines follow their local edge
        const edgeEnd: Pt = summit ? [centre + side * halfWidth, MASSIF_FOOT] : ridge[vertex + side];
        // Every line ends 70–90% of the way from its start down to the baseline, so it fills the face
        const reach = rand(MIN_REACH, MAX_REACH);

        // Each retry turns the line a little closer to vertical and shortens it slightly (never below 70%),
        // steering it away from the saddles that notch into the face, until it fits or the attempts run out
        for (let attempt = 0; attempt < 12; attempt++) {
            const dir = faceDirection([px, py], edgeEnd, Math.min(rand(0.4, 0.6) + attempt * 0.05, 0.9));
            const drop = (BASELINE - py) * Math.max(MIN_REACH, reach - attempt * 0.02);
            if (drop < 10) break;
            if (!tryAdd(detailLine([px, py], dir, drop, summit ? randInt(3, 4) : randInt(2, 3), side))) continue;
            perMassif[massif]++;
            // Often a parallel line on the same face, starting lower down the summit's shadow edge
            if (summit && perMassif[massif] < 4 && Math.random() < 0.6) {
                const [ex, ey] = ridge[vertex + side];
                const f = rand(0.35, 0.6);
                const start: Pt = [Math.round(px + (ex - px) * f), Math.round(py + (ey - py) * f)];
                if (tryAdd(detailLine(start, dir, (BASELINE - start[1]) * rand(MIN_REACH, 0.8), randInt(2, 3), side))) perMassif[massif]++;
            }
            break;
        }
    }
    // Left to right, so the staggered draw-in sweeps across the range
    const strokes = lines.sort((a, b) => a[0][0] - b[0][0]).map(toPath);

    const pines = PINES.map(({ half, trunk, x: home }): [string, string] => {
        const x = Math.round(home + rand(-PINE_JITTER, PINE_JITTER));
        const [halfWidth, baseDepth] = [Math.max(...half.map(([hx]) => hx)), half[0][1]];
        const ground = ridgeYAt(ridge, x) + 4;
        // The foliage's base is its lowest edge, so keeping all of it above the highest stretch of ridge
        // beneath it keeps the whole canopy clear of the slope; on steep ground the trunk grows to match
        const baseY = Math.floor(Math.min(ground - trunk, ridgeTopBetween(ridge, x - halfWidth, x + halfWidth) - PINE_CLEARANCE));
        const apexY = baseY - baseDepth;
        // Each half climbs the trunk from the ground, then one side of the foliage up to the apex
        const side = (dir: number) => toPath([[x, ground], ...half.map(([hx, hy]): Pt => [x + dir * hx, apexY + hy])]);
        return [side(-1), side(1)];
    });

    return { ridge: toPath(ridge), strokes, pines };
}
