const adminService = require('../services/adminService');
const asyncHandler = require('../middlewares/asyncHandler');

//get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const users = await adminService.getAllUsers(page, limit);
  res.status(200).json(users);
});

//get user by id
exports.getUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await adminService.getUserByID(id);
  res.status(200).json(user);
});

//block and unblock
exports.blockAndUnblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await adminService.blockAndUnblockUser(id);
  res.status(200).json(updatedUser);
});

//get all orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const orders = await adminService.getAllOrders(page, limit);
  res.status(200).json(orders);
});


// Change order status
exports.changeOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await adminService.changeOrderStatus(id);
  res.status(200).json(updatedOrder);
});

//total revenue
exports.getTotalRevenue = asyncHandler(async (req, res) => {
  const totalRevenue = await adminService.getTotalRevenue();
  res.status(200).json({ totalRevenue });
});


//top selling products
exports.getTopSellingProductsController = asyncHandler(async (req, res) => {
  const topSellingProducts = await adminService.getTopSellingProducts();
  res.status(200).json({
    data: topSellingProducts
  })
});


//users with most orders
exports.getUsersWithMostOrders = asyncHandler(async (req, res) => {
  const users = await adminService.getUsersWithMostOrders();
  res.status(200).json(users);
}
);


//revenue for chart (day/month/week)
exports.getRevenue = asyncHandler(async (req, res) => {
  const dailyRevenue = await adminService.getDailyRevenue();
  const weeklyRevenue = await adminService.getWeeklyRevenue();
  const monthlyRevenue = await adminService.getMonthlyRevenue();
  res.status(200).json({
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
  });
});