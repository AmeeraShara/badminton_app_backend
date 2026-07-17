const db = require('../config/db');

class DashboardModel {
    // Get all dashboard statistics
    static getDashboardCounts(callback) {
        console.log('📊 Fetching dashboard counts...');
        
        const sql = `
            SELECT
                -- Students
                (SELECT COUNT(*) FROM students) AS totalStudents,
                (SELECT COUNT(*) FROM students WHERE DATE(created_at) = CURDATE()) AS newStudentsToday,
                
                -- Age Groups
                (SELECT COUNT(*) FROM age_groups) AS totalAgeGroups,
                
                -- Sessions
                (SELECT COUNT(*) FROM sessions) AS totalSessions,
                (SELECT COUNT(*) FROM sessions WHERE DAYOFWEEK(CURDATE()) = DAYOFWEEK(sessions.created_at)) AS upcomingSessions,
                
                -- Attendance
                (SELECT COUNT(*) FROM attendance WHERE DATE(attendance_date) = CURDATE()) AS todayAttendance,
                (SELECT COUNT(*) FROM attendance WHERE status = 'Present') AS totalPresent,
                (SELECT COUNT(*) FROM attendance WHERE status = 'Present' AND DATE(attendance_date) = CURDATE()) AS presentToday,
                (SELECT COUNT(*) FROM attendance WHERE status = 'Absent' AND DATE(attendance_date) = CURDATE()) AS absentToday,
                
                -- Payments
                (SELECT COUNT(*) FROM payments) AS totalPayments,
                (SELECT SUM(amount) FROM payments) AS totalRevenue,
                (SELECT SUM(amount) FROM payments WHERE DATE(payment_date) = CURDATE()) AS todayRevenue,
                
                -- Management Team
                (SELECT COUNT(*) FROM management_team) AS totalStaff
            FROM DUAL
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('❌ Database error:', err);
                return callback(err);
            }
            
            console.log('✅ Dashboard data fetched:', results);
            
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