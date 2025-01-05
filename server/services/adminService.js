const User = require('../models/userModel');
const Order = require('../models/orderModel');
const CustomError = require('../utils/customError');

//get all users
exports.getAllUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const users = await User.find({role: 'user'}).skip(skip).limit(limit).select('-password').sort({createdAt: -1});
  const totalUsers = await User.countDocuments({role: 'user'});
  return {
    users,
    totalUsers
  };
};

// get user by id
exports.getUserByID = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user || user.role == 'admin') {
    throw new CustomError('User not found', 404);
  }
  return user;
};

//user block & unblock
exports.blockAndUnblockUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    //toggling user block status
    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  };
  
//get all orders
exports.getAllOrders = async (page, limit) => {
  const skip = (page - 1) * limit;
  const orders = await Order.find().skip(skip).limit(limit).populate('userId items.productId').sort({createdAt: -1});
  const totalOrders = await Order.countDocuments();
  return {
    orders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders
  };
};


// Function to change the order status
exports.changeOrderStatus = async (id) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new Error('Order not found');
  }
  
  let newStatus;
  if (order.status === 'placed') {
    newStatus = 'shipped';
  } else if (order.status === 'shipped') {
    newStatus = 'delivered';
  } else if (order.status === 'delivered') {
    newStatus = 'cancelled';
    order.razorpayPaymentStatus = 'refunded'
  } else {
    return order; // No further status change possible
  }
  order.status = newStatus;

  await order.save();

  return order;
};

//totoal revenue
exports.getTotalRevenue = async () => {
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  return totalRevenue[0]?.total || 0;
};


exports.getTopSellingProducts = async () => {
  try {
    const topSellingProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },

      // for taking each product seperately from the array
      { $unwind: '$items' },

      // Group by productId to sum the quantities sold
      { $group: { 
        _id: '$items.productId', 
        totalQuantity: { $sum: '$items.quantity' }
      } },

      // 
      { $lookup: {
        from: 'products', 
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      } },

      // accessing product info
      { $unwind: '$productDetails' },

      { $sort: { totalQuantity: -1 } },

      { $limit: 5 },
    ]);

    return topSellingProducts;
  } catch (error) {
    throw new Error('Failed to get top selling products');
  }
};


exports.getUsersWithMostOrders = async () => {
  try {
    const usersWithMostOrders = await Order.aggregate([
      { $group: { 
        _id: '$userId', 
        orderCount: { $sum: 1 }
      } },

      // Sort by the order count in descending order
      { $sort: { orderCount: -1 } },

      // Limit to the top 5 users with most orders
      { $limit: 5 },

      // lookup to get user details (populate)
      { $lookup: {
        from: 'users', 
        localField: '_id', 
        foreignField: '_id',
        as: 'userDetails'
      } },

      { $unwind: '$userDetails' },

      { $project: {
        _id: 0,
        username: '$userDetails.username',
        email: '$userDetails.email',
        orderCount: 1
      } }
    ]);

    return usersWithMostOrders;
  } catch (error) {
    throw new Error('Failed to get users with most orders');
  }
};





exports.getDailyRevenue = async () => {
  try {
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
        },
      },
      {
        $project: {
          createdAt: { $toDate: "$createdAt" }, // Ensure createdAt is converted to a Date
          totalAmount: 1,
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Format the date as YYYY-MM-DD
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: "$date", // Group by the formatted date
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id": 1 },
      }
    ]);
    return dailyRevenue;
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    throw new Error("Error fetching daily revenue");
  }
};



// weekly revenue
exports.getWeeklyRevenue = async () => {
  try {
    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
        },
      },
      {
        $project: {
          createdAt: { $toDate: "$createdAt" }, // Convert string to Date
          totalAmount: 1,
        },
      },
      {
        $project: {
          week: { $isoWeek: "$createdAt" }, // Get ISO week number
          year: { $year: "$createdAt" },
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
      {
        $project: {
          week: 1,
          year: 1,
          totalRevenue: 1,
        },
      }
    ]);
    return weeklyRevenue;
  } catch (error) {
    throw new Error('Error fetching weekly revenue');
  }
};


//monthly revenue
exports.getMonthlyRevenue = async () => {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
        },
      },
      {
        $project: {
          createdAt: { $toDate: "$createdAt" }, // Convert string to Date
          totalAmount: 1,
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" }, // Get month
          year: { $year: "$createdAt" }, // Get year
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          month: 1,
          year: 1,
          totalRevenue: 1,
        },
      }
    ]);
    return monthlyRevenue;
  } catch (error) {
    throw new Error('Error fetching monthly revenue');
  }
};



