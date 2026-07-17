const DashboardModel = require('../models/dashboardModel');

class DashboardController {
    static getCounts(req, res) {
        
        DashboardModel.getDashboardCounts((err, result) => {
            if (err) {
                console.error('❌ Dashboard error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch dashboard data',
                    error: err.message
                });
            }


            // Ensure we have valid data
            const data = result || {};
            
            res.json({
                success: true,
                data: {
                    totalStudents: data.totalStudents || 0,
                    newStudentsToday: data.newStudentsToday || 0,
                    totalAgeGroups: data.totalAgeGroups || 0,
                    totalSessions: data.totalSessions || 0,
                    upcomingSessions: data.upcomingSessions || 0,
                    todayAttendance: data.todayAttendance || 0,
                    totalPresent: data.totalPresent || 0,
                    presentToday: data.presentToday || 0,
                    absentToday: data.absentToday || 0,
                    totalPayments: data.totalPayments || 0,
                    totalRevenue: data.totalRevenue || 0,
                    todayRevenue: data.todayRevenue || 0,
                    totalStaff: data.totalStaff || 0
                }
            });
        });
    }

    static getDetailedStats(req, res) {
        DashboardModel.getDetailedStats((err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch detailed stats',
                    error: err.message
                });
            }

            res.json({
                success: true,
                data: result
            });
        });
    }
}

module.exports = DashboardController;