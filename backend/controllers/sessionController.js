const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const { sessionName } = req.body;
    const session = new Session({
      userId: req.user.userId,
      sessionName,
      chatHistory: [],
      code: { jsx: '', css: '' },
      uiState: {}
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Create session error', error: err.message });
  }
};

exports.listSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'List sessions error', error: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Get session error', error: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Update session error', error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete session error', error: err.message });
  }
}; 