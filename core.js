export const GAMES = [
  { id: 'twenty48', name: '2048', en: 'MERGE & MAKE IT', category: 'puzzle', description: '小小的数字，大大的上瘾。', tags: ['经典必玩', '合成'], badge: '人气之选', color: '#e5b16d', time: '5–10 分钟', instructions: '滑动棋盘或按方向键 / WASD，让相同数字合并。合成 2048 即可获胜；支持撤回上一步。' },
  { id: 'snake', name: '贪吃蛇', en: 'ONE MORE BITE', category: 'arcade', description: '再吃一口，就真的最后一口。', tags: ['童年回忆', '反应'], badge: '', color: '#9fc89d', time: '2–5 分钟', instructions: '滑动、方向键 / WASD 或屏幕方向按钮控制小蛇。吃到果实会变长，避开墙壁和自己。' },
  { id: 'blocks', name: '方块消除', en: 'FALL INTO PLACE', category: 'arcade', description: '把生活的棱角，拼得刚刚好。', tags: ['经典街机', '消除'], badge: '', color: '#b1a2db', time: '5–15 分钟', instructions: '左右键移动，上键旋转，下键加速，空格直接落下。手机可使用下方按钮；填满一行即可消除。' },
  { id: 'mines', name: '扫雷', en: 'A LITTLE SUSPENSE', category: 'puzzle', description: '每一次点击，都是一次小冒险。', tags: ['逻辑推理', '经典'], badge: '', color: '#94b6ce', time: '3–8 分钟', instructions: '打开所有安全格即可获胜，数字表示周围八格的雷数。右键标旗；手机切换「插旗模式」。第一下及周围始终安全。' },
  { id: 'sudoku', name: '数独', en: 'FIND YOUR BALANCE', category: 'puzzle', description: '在九宫格里，让思绪慢下来。', tags: ['静心挑战', '数字'], badge: '', color: '#a9bda8', time: '10–20 分钟', instructions: '选择空格再输入 1–9；每行、每列、每个九宫格的数字不能重复。可用键盘数字、方向键、退格键，也可使用数字面板。' },
  { id: 'gomoku', name: '五子棋', en: 'THINK A MOVE AHEAD', category: 'strategy', description: '方寸之间，藏着你的下一步。', tags: ['人机对弈', '策略'], badge: '', color: '#cdaf89', time: '5–15 分钟', instructions: '你执黑先行，点击交叉点落子，与电脑对弈。横、竖、斜任一方向先连成五子即可获胜。方向键移动光标，回车落子。' },
  { id: 'breakout', name: '打砖块', en: 'BREAK A LITTLE FREE', category: 'arcade', description: '100 关冒险，把烦恼炸个痛快。', tags: ['100 个关卡', '道具组合'], badge: '100 关升级', color: '#d38e8c', time: '3–8 分钟', instructions: '拖动、鼠标或左右键控制挡板，空格发球。点击掉落道具或用挡板接住；爆炸球会范围爆破，按 E 或点「引爆」可主动引爆。灰蓝色墙体无法破坏，穿透球也会反弹，爆炸无法摧毁，无需清除。100 关自由选择，进度自动保存。' },
  { id: 'memory', name: '记忆翻牌', en: 'A PERFECT LITTLE MATCH', category: 'puzzle', description: '记住这一眼，遇见下一对。', tags: ['记忆力', '轻松'], badge: '', color: '#b9a1bd', time: '2–5 分钟', instructions: '每次翻开两张卡片，找到相同图案即可配对。配对全部八组获胜，用更少的步数挑战更高成绩。' },
  { id: 'slide', name: '数字华容道', en: 'MAKE YOUR NEXT MOVE', category: 'puzzle', description: '挪一挪，答案就会出现。', tags: ['烧脑', '拼图'], badge: '', color: '#91bdb7', time: '3–10 分钟', instructions: '点击空格旁的数字，把 1–15 按从左到右、从上到下排列，空格留在右下角。方向键可以移动空格；所有开局均可解。' },
  { id: 'orbit', name: '星轨穿梭', en: 'A SMALL COSMIC ESCAPE', category: 'arcade', description: '穿过星海，收集你的小小光芒。', tags: ['原创设计', '躲避'], badge: '独乐原创', color: '#87a7ce', time: '2–5 分钟', instructions: '拖动飞船或按方向键 / WASD 在星海中移动。躲开陨石，收集金色星星。坚持越久分数越高；碰撞会消耗护盾。' },
];
export const CATEGORIES = { puzzle: '益智解谜', arcade: '街机动作', strategy: '棋盘策略' };
export const shuffle = (items, rng = Math.random) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
};
export function mergeLine(line) {
  const values = line.filter(Boolean), result = []; let score = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) { result.push(values[i] * 2); score += values[i] * 2; i++; }
    else result.push(values[i]);
  }
  while (result.length < line.length) result.push(0);
  return { line: result, score };
}
export function move2048(board, direction) {
  const next = [...board]; let score = 0;
  for (let i = 0; i < 4; i++) {
    const indices = Array.from({ length: 4 }, (_, j) => direction === 'left' ? i * 4 + j : direction === 'right' ? i * 4 + 3 - j : direction === 'up' ? j * 4 + i : (3 - j) * 4 + i);
    const merged = mergeLine(indices.map(k => board[k])); score += merged.score;
    indices.forEach((k, j) => { next[k] = merged.line[j]; });
  }
  return { board: next, score, changed: next.some((v, i) => v !== board[i]) };
}
export function add2048Tile(board, rng = Math.random) {
  const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0), next = [...board];
  if (empty.length) next[empty[Math.floor(rng() * empty.length)]] = rng() < .9 ? 2 : 4;
  return next;
}
export const canMove2048 = board => ['left', 'right', 'up', 'down'].some(d => move2048(board, d).changed);
export function createMines(size = 9, count = 10, first = 0, rng = Math.random) {
  const safeRow = Math.floor(first / size), safeCol = first % size;
  const eligible = Array.from({ length: size * size }, (_, i) => i).filter(i => Math.abs(Math.floor(i / size) - safeRow) > 1 || Math.abs(i % size - safeCol) > 1);
  const bombs = new Set(shuffle(eligible, rng).slice(0, count));
  return Array.from({ length: size * size }, (_, i) => bombs.has(i) ? -1 : neighbors(i, size).filter(n => bombs.has(n)).length);
}
export function neighbors(index, size) {
  const row = Math.floor(index / size), col = index % size, list = [];
  for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) if ((x || y) && row + y >= 0 && row + y < size && col + x >= 0 && col + x < size) list.push((row + y) * size + col + x);
  return list;
}
export function revealMines(field, index, opened, flags, size = 9) {
  const result = new Set(opened), queue = [index];
  while (queue.length) { const i = queue.pop(); if (result.has(i) || flags.has(i) || field[i] < 0) continue; result.add(i); if (field[i] === 0) queue.push(...neighbors(i, size).filter(n => !result.has(n))); }
  return result;
}
export function createSudoku(rng = Math.random) {
  const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const answer = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
  const digits = [0, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)];
  const rows = shuffle([0, 1, 2], rng).flatMap(b => shuffle([0, 1, 2], rng).map(r => b * 3 + r));
  const cols = shuffle([0, 1, 2], rng).flatMap(b => shuffle([0, 1, 2], rng).map(c => b * 3 + c));
  const transpose = rng() > .5;
  const transform = text => rows.flatMap(r => cols.map(c => digits[Number(text[transpose ? c * 9 + r : r * 9 + c]) ]));
  return { puzzle: transform(puzzle), solution: transform(answer) };
}
export function sudokuConflicts(board, index) {
  const value = board[index]; if (!value) return false;
  const row = Math.floor(index / 9), col = index % 9;
  return board.some((v, i) => i !== index && v === value && (Math.floor(i / 9) === row || i % 9 === col || Math.floor(i / 27) === Math.floor(row / 3) && Math.floor(i % 9 / 3) === Math.floor(col / 3)));
}
export function fiveInRow(board, index, player, size = 15) {
  const row = Math.floor(index / size), col = index % size;
  return [[1, 0], [0, 1], [1, 1], [1, -1]].some(([dx, dy]) => {
    let count = 1;
    for (const sign of [-1, 1]) { let x = col + dx * sign, y = row + dy * sign; while (x >= 0 && x < size && y >= 0 && y < size && board[y * size + x] === player) { count++; x += dx * sign; y += dy * sign; } }
    return count >= 5;
  });
}
export function chooseGomokuMove(board, rng = Math.random) {
  const available = board.map((v, i) => v ? -1 : i).filter(i => i >= 0); if (!available.length) return -1;
  const near = available.filter(i => neighbors(i, 15).some(n => board[n])); if (!near.length) return 112;
  for (const player of [2, 1]) for (const index of near) { const copy = [...board]; copy[index] = player; if (fiveInRow(copy, index, player)) return index; }
  let best = -Infinity, move = near[0];
  for (const index of near) {
    let score = rng() * 2;
    for (const player of [2, 1]) for (const [dx, dy] of [[1,0],[0,1],[1,1],[1,-1]]) {
      let count = 1, open = 0;
      for (const sign of [-1, 1]) { let x = index % 15 + dx * sign, y = Math.floor(index / 15) + dy * sign; while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[y * 15 + x] === player) { count++; x += dx * sign; y += dy * sign; } if (x >= 0 && x < 15 && y >= 0 && y < 15 && !board[y * 15 + x]) open++; }
      score += open ? Math.pow(8, count - 1) * (open === 2 ? 3 : 1) * (player === 2 ? 1.1 : 1) : 0;
    }
    score -= Math.hypot(index % 15 - 7, Math.floor(index / 15) - 7) * .1;
    if (score > best) { best = score; move = index; }
  }
  return move;
}
export const slideNeighbors = (index, size = 4) => [index - size, index + size, index % size ? index - 1 : -1, index % size < size - 1 ? index + 1 : -1].filter(i => i >= 0 && i < size * size);
export function createSlide(rng = Math.random, steps = 160) {
  const board = Array.from({ length: 16 }, (_, i) => (i + 1) % 16); let blank = 15, previous = -1;
  for (let i = 0; i < steps; i++) { const options = slideNeighbors(blank).filter(n => n !== previous), next = options[Math.floor(rng() * options.length)]; [board[blank], board[next]] = [board[next], board[blank]]; previous = blank; blank = next; }
  if (board.every((v, i) => v === (i + 1) % 16)) [board[14], board[15]] = [board[15], board[14]];
  return board;
}
export function slideSolvable(board) {
  let inversions = 0; const values = board.filter(Boolean);
  for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) if (values[i] > values[j]) inversions++;
  return (inversions + 4 - Math.floor(board.indexOf(0) / 4)) % 2 === 1;
}
export const SHAPES = [[[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]]];
export const rotateShape = shape => shape[0].map((_, x) => shape.map(row => row[x]).reverse());
export function blockCollision(board, shape, x, y) { return shape.some((row, dy) => row.some((v, dx) => v && (x + dx < 0 || x + dx >= 10 || y + dy >= 20 || y + dy >= 0 && board[y + dy][x + dx]))); }
export function clearBlockLines(board) { const rows = board.filter(row => row.some(v => !v)); const cleared = 20 - rows.length; return { board: [...Array.from({ length: cleared }, () => Array(10).fill(0)), ...rows.map(row => [...row])], cleared }; }
