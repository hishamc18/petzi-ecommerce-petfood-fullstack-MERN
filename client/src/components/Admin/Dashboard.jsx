import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./admin.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../features/authSlice";
import { fetchAllOrders, fetchRevenue, getUsersWithMostOrders, revenueChart } from "../../features/orderSlice";
import { fetchProducts, getTopSellingProducts } from "../../features/productSlice";

// Registering Chart.js components (library)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function Dashboard() {
    const dispatch = useDispatch()
    const { totalUsers } = useSelector((state) => state.auth)
    const { total, totalCatProducts, totalDogProducts, topSellingProducts } = useSelector((state) => state.products)
    const { totalOrders, totalRevenue, allOrders, topUsers, monthlyRevenue, weeklyRevenue, dailyRevenue, } = useSelector((state) => state.order)


    useEffect(() => {
        dispatch(fetchAllUsers({ page: 1, limit: 10 }))
        dispatch(fetchAllOrders({page: 1, limit: 10}))
        dispatch(fetchRevenue())
        dispatch(fetchProducts({}))
        dispatch(getTopSellingProducts())
        dispatch(fetchAllOrders({}))
        dispatch(getUsersWithMostOrders())
        dispatch(revenueChart())
    }, [dispatch])

    const monthlyChartData = {
        labels: monthlyRevenue.map(item => `${item._id.year}-${String(item._id.month).padStart(2, '0')}`),
        datasets: [
            {
                label: "Monthly Revenue",
                data: monthlyRevenue.map(item => item.totalRevenue), // Revenue values
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };
    

    const weeklyChartData = {
        labels: weeklyRevenue.map(item => `${item._id.year}-W${String(item._id.week).padStart(2, '0')}`),
        datasets: [
            {
                label: "Weekly Revenue",
                data: weeklyRevenue.map(item => item.totalRevenue),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    };
    

    const dailyChartData = {
        labels: dailyRevenue.map(item => item._id),
        datasets: [
            {
                label: "Daily Revenue",
                data: dailyRevenue.map(item => item.totalRevenue),
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    };
    

  
    return (
        <div className="admin-dashboard-container">
            <div className="DashboardHead">
                <h1>Dash<span>board</span></h1>
            </div>

            <div className="admin-dashboardCard-container">
                {/* Dashboard Cards */}
                <div className="allDashBoardCards">
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Users</h3>
                            <p>{totalUsers}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Orders</h3>
                            <p>{totalOrders}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Total Revenue</h3>
                            <p>₹{totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Product Overview</h3>
                            <p><strong>Total Products: </strong>{total}</p>
                            <p><strong>Cat Products: </strong>{totalCatProducts}</p>
                            <p><strong>Dog Products: </strong>{totalDogProducts}</p>
                        </div>
                    </div>
                    <div className="admin-dashcard">
                        <div className="admin-bg"></div>
                        <div className="admin-blob"></div>
                        <div className="admin-dashCardcontent">
                            <h3>Top Selling Products</h3>
                            <ul>
                                {topSellingProducts.map((product) => (
                                    <li key={product._id}>{product?.productDetails.name} ({product.productDetails.category}) - ({product.totalQuantity} Qty)</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Revenue Charts */}
                <div className="revenueContainer">
                    <h3>Revenue Details</h3>
                    <div className="revenueDetails">
                        <div className="admin-chart-container">
                            <h2>Monthly Revenue</h2>
                            <Bar data={monthlyChartData} options={{ responsive: true }} />
                        </div>
                        <div className="admin-chart-container">
                            <h2>Weekly Revenue</h2>
                            <Bar data={weeklyChartData} options={{ responsive: true }} />
                        </div>
                        <div className="admin-chart-container">
                            <h2>Daily Revenue</h2>
                            <Bar data={dailyChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <h2 className="revenueContainer2">Order Details</h2>
                <div className="admin-table-container">
                    <div className="table1admin">
                      <h2>Recent Orders</h2>
                      <table className="admin-recent-orders-table">
                          <thead>
                              <tr>
                                  <th>Order ID</th>
                                  <th>Amount</th>
                                  <th>Username</th>
                                  <th>Order Status</th>
                                  <th>Ordered Date</th>
                              </tr>
                          </thead>
                          <tbody>
                              {allOrders.slice(0,7)
                                  .map((order) => (
                                      <tr key={order._id}>
                                          <td>{order._id}</td>
                                          <td>₹{order.totalAmount}</td>
                                          <td>{order.shippingAddress.fullName}</td>
                                          <td>{order.status}</td>
                                          <td>{order.createdAt.slice(0,10)}</td>
                                      </tr>
                                  ))}
                          </tbody>
                      </table>
                    </div>

                    <div className="table2admin">
                      <h2>Users with Most Orders</h2>
                      <table className="admin-recent-orders-table">
                          <thead>
                              <tr>
                                  <th>Username</th>
                                  <th>No. of Orders</th>
                                  <th>Email</th>
                              </tr>
                          </thead>
                          <tbody>
                              {topUsers.map((user,index) => (
                                  <tr key={index}>
                                      <td>{user.username}</td>
                                      <td>{user.orderCount}</td>
                                      <td>{user.email}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
