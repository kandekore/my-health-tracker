const router   = require('express').Router();
const Seizure  = require('../models/Seizure');

// ── POST /api/seizures  ───────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const saved = await Seizure.create(req.body);
    res.json(saved);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ── GET /api/seizures?from=2025-06-01&to=2025-06-30&type=Tonic-Clonic ──
router.get('/', async (req, res) => {
  const { from, to, type, userId } = req.query;
  const q = { userId };
  if (from || to) q.time = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
  if (type)      q.type = type;
  res.json(await Seizure.find(q).sort({ time: -1 }));
});

// ── PATCH /api/seizures/:id ───────────────────────────────────────
router.patch('/:id', async (req, res) => {
  res.json(await Seizure.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

module.exports = router;
