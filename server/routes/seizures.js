const router  = require('express').Router();
const Seizure = require('../models/Seizure');
const { toCsv } = require('../utils/csv');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT     = 200;

router.post('/', async (req, res) => {
  try {
    const saved = await Seizure.create({ ...req.body, userId: req.userId });
    res.json(saved);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.get('/export.csv', async (req, res) => {
  const { from, to } = req.query;
  const q = { userId: req.userId };
  if (from || to) q.time = { ...(from && { $gte: from }), ...(to && { $lte: to }) };

  const rows = await Seizure.find(q).sort({ time: -1 }).lean();
  const csv = toCsv(rows, [
    { label: 'time',        get: (r) => new Date(r.time).toISOString() },
    { label: 'type',        key: 'type' },
    { label: 'durationSec', key: 'durationSec' },
    { label: 'createdAt',   get: (r) => r.createdAt ? new Date(r.createdAt).toISOString() : '' },
  ]);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="seizures.csv"');
  res.send(csv);
});

router.get('/', async (req, res) => {
  const { from, to, type } = req.query;
  const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const skip  = Math.max(Number(req.query.skip) || 0, 0);

  const q = { userId: req.userId };
  if (from || to) q.time = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
  if (type)       q.type = type;

  const [items, total] = await Promise.all([
    Seizure.find(q).sort({ time: -1 }).skip(skip).limit(limit),
    Seizure.countDocuments(q),
  ]);
  res.json({ items, total, limit, skip });
});

router.patch('/:id', async (req, res) => {
  const updated = await Seizure.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true },
  );
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Seizure.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
