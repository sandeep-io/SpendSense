const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const ObjectId = mongoose.Types.ObjectId;

/**
 * Monthly Summary
 */
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new ObjectId(req.userId),
          date: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$category",
          },
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Category Breakdown
 */
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const now = new Date();

    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const breakdown = await Expense.aggregate([
      {
        $match: {
          userId: new ObjectId(req.userId),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
          avgAmount: {
            $avg: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      breakdown,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Spending Trend
 */
exports.getSpendingTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const trend = await Expense.aggregate([
      {
        $match: {
          userId: new ObjectId(req.userId),
          date: {
            $gte: since,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      trend,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Top Merchants
 */
exports.getTopMerchants = async (req, res, next) => {
  try {
    const now = new Date();

    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const merchants = await Expense.aggregate([
      {
        $match: {
          userId: new ObjectId(req.userId),

          merchant: {
            $nin: [null, ""],
          },

          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$merchant",
          total: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      merchants,
    });
  } catch (err) {
    next(err);
  }
};