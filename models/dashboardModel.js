const db = require('../config/db');

class DashboardModel {
    // Get all dashboard statistics
    static getDashboardCounts(callback) {


        db.query(sql, (err, results) => {
            if (err) {
                console.error('❌ Database error:', err);
                return callback(err);
            }
            
            
            // Check if results exists and has data
            if (!results || results.length === 0) {
                console.log('⚠️ No results returned, returning default values');
                return callback(null, {
                    totalStudents: 0,
                    newStudentsToday: 0,
                    totalAgeGroups: 0,
                    totalSessions: 0,
                    upcomingSessions: 0,
                    todayAttendance: 0,
                    totalPresent: 0,
                    presentToday: 0,
                    absentToday: 0,
                    totalPayments: 0,
                    totalRevenue: 0,
                    todayRevenue: 0,
                    totalStaff: 0
                });
            }
            
            callback(null, results[0]);
        });
    }

    // Get detailed statistics for charts
    static getDetailedStats(callback) {
        const sql = `
            SELECT 
                -- Students by Age Group
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'age_group', ag.age_group_name,
                        'count', COUNT(s.id)
                    )
                ) FROM age_groups ag 
                LEFT JOIN students s ON ag.id = s.age_group_id 
                GROUP BY ag.id) AS studentsByAgeGroup,
                
                -- Monthly Attendance (last 6 months)
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'month', DATE_FORMAT(attendance_date, '%Y-%m'),
                        'present', SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END),
                        'absent', SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END)
                    )
                ) FROM attendance 
                WHERE attendance_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(attendance_date, '%Y-%m')) AS monthlyAttendance,
                
                -- Revenue by month (last 6 months)
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'month', DATE_FORMAT(payment_date, '%Y-%m'),
                        'amount', SUM(amount)
                    )
                ) FROM payments 
                WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(payment_date, '%Y-%m')) AS revenueByMonth
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('❌ Detailed stats error:', err);
                return callback(err);
            }
            callback(null, results[0]);
        });
    }
}

module.exports = DashboardModel;