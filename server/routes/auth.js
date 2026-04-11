const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });

const publicUser = (u) => ({ id: u._id, email: u.email, name: u.name });

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email and 6+ char password required' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
