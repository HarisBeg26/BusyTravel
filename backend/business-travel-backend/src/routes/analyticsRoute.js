const express = require('express');
const router = express.Router();

// In-memory storage for demonstration purposes
let events = [];
let susSubmissions = [];

// Endpoint to receive analytics events
router.post('/events', (req, res) => {
  const event = req.body;
  console.log('Received analytics event:', event);
  events.push(event);
  res.status(200).json({ message: 'Event received' });
});

// Endpoint to receive SUS questionnaire submissions
router.post('/sus', (req, res) => {
  const submission = req.body;
  console.log('Received SUS submission:', submission);
  susSubmissions.push(submission);
  res.status(200).json({ message: 'SUS submission received' });
});

// Endpoint to get a summary of events
router.get('/events/summary', (req, res) => {
  const summary = events.reduce((acc, event) => {
    acc[event.eventName] = (acc[event.eventName] || 0) + 1;
    return acc;
  }, {});
  res.status(200).json(summary);
});

// Endpoint to get a summary of SUS submissions
router.get('/sus/summary', (req, res) => {
  const summary = {
    totalSubmissions: susSubmissions.length,
    averageScore: susSubmissions.reduce((acc, sub) => acc + sub.score, 0) / (susSubmissions.length || 1),
    submissionsByVariant: susSubmissions.reduce((acc, sub) => {
      const variant = sub.variant || 'unknown';
      if (!acc[variant]) {
        acc[variant] = { count: 0, totalScore: 0 };
      }
      acc[variant].count++;
      acc[variant].totalScore += sub.score;
      return acc;
    }, {})
  };

  // Calculate average score per variant
  for (const variant in summary.submissionsByVariant) {
    summary.submissionsByVariant[variant].averageScore = 
      summary.submissionsByVariant[variant].totalScore / (summary.submissionsByVariant[variant].count || 1);
  }

  res.status(200).json(summary);
});

module.exports = router;
