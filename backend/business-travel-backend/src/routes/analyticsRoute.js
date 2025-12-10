// Analytics Route for A-B Testing Data
const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (use database in production)
let analyticsData = [];
let susData = [];

/**
 * @route   POST /api/analytics/sus
 * @desc    Store SUS questionnaire responses
 * @access  Public
 */
router.post('/sus', async (req, res) => {
  try {
    const {
      pageName,
      variant,
      responses,
      score,
      questions,
      timestamp,
      sessionId
    } = req.body;

    // Validate required fields
    if (!sessionId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({
        error: 'sessionId and responses array are required'
      });
    }

    // Create SUS record
    const susRecord = {
      id: `sus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      pageName,
      variant,
      responses,
      score,
      questions,
      timestamp: timestamp || Date.now(),
      createdAt: new Date().toISOString()
    };

    // Store the record
    susData.push(susRecord);

    console.log('SUS Questionnaire Response Recorded:', {
      sessionId,
      pageName,
      variant,
      score,
      timestamp: new Date(timestamp).toISOString()
    });

    res.status(201).json({
      message: 'SUS response recorded successfully',
      susId: susRecord.id,
      score: score
    });

  } catch (error) {
    console.error('Error recording SUS response:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/analytics/sus
 * @desc    Get SUS questionnaire data
 * @access  Public
 */
router.get('/sus', async (req, res) => {
  try {
    const {
      sessionId,
      pageName,
      variant,
      minScore,
      maxScore,
      limit = 100
    } = req.query;

    let filteredData = [...susData];

    // Apply filters
    if (sessionId) {
      filteredData = filteredData.filter(record => record.sessionId === sessionId);
    }

    if (pageName) {
      filteredData = filteredData.filter(record => record.pageName === pageName);
    }

    if (variant) {
      filteredData = filteredData.filter(record => record.variant === variant);
    }

    if (minScore) {
      filteredData = filteredData.filter(record => record.score >= parseFloat(minScore));
    }

    if (maxScore) {
      filteredData = filteredData.filter(record => record.score <= parseFloat(maxScore));
    }

    // Sort by timestamp (newest first)
    filteredData.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    filteredData = filteredData.slice(0, parseInt(limit));

    res.json({
      susResponses: filteredData,
      total: filteredData.length,
      filters: {
        sessionId,
        pageName,
        variant,
        minScore,
        maxScore,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching SUS data:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/analytics/sus/summary
 * @desc    Get SUS data summary and statistics
 * @access  Public
 */
router.get('/sus/summary', async (req, res) => {
  try {
    const summary = {
      totalResponses: susData.length,
      averageScore: 0,
      scoreDistribution: {},
      variantComparison: {},
      pageComparison: {}
    };

    if (susData.length > 0) {
      // Calculate average score
      const totalScore = susData.reduce((sum, record) => sum + record.score, 0);
      summary.averageScore = Math.round((totalScore / susData.length) * 100) / 100;

      // Score distribution (by ranges)
      const scoreRanges = {
        'Poor (0-60)': 0,
        'OK (60-70)': 0,
        'Good (70-85)': 0,
        'Excellent (85-100)': 0
      };

      susData.forEach(record => {
        if (record.score < 60) scoreRanges['Poor (0-60)']++;
        else if (record.score < 70) scoreRanges['OK (60-70)']++;
        else if (record.score < 85) scoreRanges['Good (70-85)']++;
        else scoreRanges['Excellent (85-100)']++;
      });

      summary.scoreDistribution = scoreRanges;

      // Variant comparison
      const variantStats = {};
      susData.forEach(record => {
        const key = `${record.pageName}_${record.variant}`;
        if (!variantStats[key]) {
          variantStats[key] = {
            pageName: record.pageName,
            variant: record.variant,
            count: 0,
            totalScore: 0,
            scores: []
          };
        }
        variantStats[key].count++;
        variantStats[key].totalScore += record.score;
        variantStats[key].scores.push(record.score);
      });

      Object.keys(variantStats).forEach(key => {
        const stats = variantStats[key];
        stats.averageScore = Math.round((stats.totalScore / stats.count) * 100) / 100;
        delete stats.totalScore; // Remove intermediate calculation
      });

      summary.variantComparison = variantStats;

      // Page comparison
      const pageStats = {};
      susData.forEach(record => {
        if (!pageStats[record.pageName]) {
          pageStats[record.pageName] = {
            count: 0,
            totalScore: 0,
            variants: {}
          };
        }
        pageStats[record.pageName].count++;
        pageStats[record.pageName].totalScore += record.score;

        if (!pageStats[record.pageName].variants[record.variant]) {
          pageStats[record.pageName].variants[record.variant] = {
            count: 0,
            totalScore: 0
          };
        }
        pageStats[record.pageName].variants[record.variant].count++;
        pageStats[record.pageName].variants[record.variant].totalScore += record.score;
      });

      Object.keys(pageStats).forEach(pageName => {
        const stats = pageStats[pageName];
        stats.averageScore = Math.round((stats.totalScore / stats.count) * 100) / 100;
        
        Object.keys(stats.variants).forEach(variant => {
          const variantStats = stats.variants[variant];
          variantStats.averageScore = Math.round((variantStats.totalScore / variantStats.count) * 100) / 100;
          delete variantStats.totalScore;
        });
        
        delete stats.totalScore;
      });

      summary.pageComparison = pageStats;
    }

    res.json(summary);

  } catch (error) {
    console.error('Error generating SUS summary:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/analytics/events
 * @desc    Store A-B testing analytics events
 * @access  Public
 */
router.post('/events', async (req, res) => {
  try {
    const {
      eventName,
      sessionId,
      testGroups,
      timestamp,
      url,
      userAgent,
      ...eventData
    } = req.body;

    // Validate required fields
    if (!eventName || !sessionId) {
      return res.status(400).json({
        error: 'eventName and sessionId are required'
      });
    }

    // Create analytics record
    const analyticsRecord = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventName,
      sessionId,
      testGroups,
      timestamp: timestamp || Date.now(),
      url,
      userAgent,
      eventData,
      createdAt: new Date().toISOString()
    };

    // Store the record (use database in production)
    analyticsData.push(analyticsRecord);

    // Log for debugging
    console.log('A-B Testing Event Recorded:', {
      eventName,
      sessionId,
      testGroups,
      timestamp: new Date(timestamp).toISOString()
    });

    res.status(201).json({
      message: 'Event recorded successfully',
      eventId: analyticsRecord.id
    });

  } catch (error) {
    console.error('Error recording analytics event:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/analytics/events
 * @desc    Get A-B testing analytics data
 * @access  Public
 */
router.get('/events', async (req, res) => {
  try {
    const {
      sessionId,
      eventName,
      testGroup,
      startDate,
      endDate,
      limit = 100
    } = req.query;

    let filteredData = [...analyticsData];

    // Apply filters
    if (sessionId) {
      filteredData = filteredData.filter(record => record.sessionId === sessionId);
    }

    if (eventName) {
      filteredData = filteredData.filter(record => record.eventName === eventName);
    }

    if (testGroup) {
      filteredData = filteredData.filter(record => 
        JSON.stringify(record.testGroups).includes(testGroup)
      );
    }

    if (startDate) {
      const startTime = new Date(startDate).getTime();
      filteredData = filteredData.filter(record => record.timestamp >= startTime);
    }

    if (endDate) {
      const endTime = new Date(endDate).getTime();
      filteredData = filteredData.filter(record => record.timestamp <= endTime);
    }

    // Sort by timestamp (newest first)
    filteredData.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    filteredData = filteredData.slice(0, parseInt(limit));

    res.json({
      events: filteredData,
      total: filteredData.length,
      filters: {
        sessionId,
        eventName,
        testGroup,
        startDate,
        endDate,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching analytics events:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/analytics/summary
 * @desc    Get A-B testing analytics summary
 * @access  Public
 */
router.get('/summary', async (req, res) => {
  try {
    const summary = {
      totalEvents: analyticsData.length,
      uniqueSessions: new Set(analyticsData.map(record => record.sessionId)).size,
      eventTypes: {},
      testGroupDistribution: {},
      timeRange: {
        earliest: null,
        latest: null
      }
    };

    if (analyticsData.length > 0) {
      // Count event types
      analyticsData.forEach(record => {
        summary.eventTypes[record.eventName] = (summary.eventTypes[record.eventName] || 0) + 1;
      });

      // Count test group distribution
      analyticsData.forEach(record => {
        if (record.testGroups) {
          Object.entries(record.testGroups).forEach(([testName, variant]) => {
            if (!summary.testGroupDistribution[testName]) {
              summary.testGroupDistribution[testName] = {};
            }
            summary.testGroupDistribution[testName][variant] = 
              (summary.testGroupDistribution[testName][variant] || 0) + 1;
          });
        }
      });

      // Calculate time range
      const timestamps = analyticsData.map(record => record.timestamp).sort((a, b) => a - b);
      summary.timeRange.earliest = new Date(timestamps[0]).toISOString();
      summary.timeRange.latest = new Date(timestamps[timestamps.length - 1]).toISOString();
    }

    res.json(summary);

  } catch (error) {
    console.error('Error generating analytics summary:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/analytics/events
 * @desc    Clear all analytics data (for testing purposes)
 * @access  Public
 */
router.delete('/events', async (req, res) => {
  try {
    const previousCount = analyticsData.length;
    analyticsData = [];
    
    res.json({
      message: 'All analytics data cleared',
      deletedCount: previousCount
    });

  } catch (error) {
    console.error('Error clearing analytics data:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;