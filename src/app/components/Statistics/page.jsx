import React from 'react'

function StatisticsPage() {
    // หน้าสถิติ
    const totalStudents = students.length;
    const todayRecords = attendanceRecords.filter(r => r.date === new Date().toLocaleDateString('en-CA'));
    const presentToday = todayRecords.filter(r => r.status === 'Present').length;
    const lateToday = todayRecords.filter(r => r.status === 'Late').length;
    const absentToday = totalStudents - presentToday - lateToday;


    return (
        // หน้าสถิติ

        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">สถิติการเข้าเรียน</h2>

                {/* สถิติรวม */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{totalStudents}</div>
                        <div className="text-blue-700 font-medium">นักเรียนทั้งหมด</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">{presentToday}</div>
                        <div className="text-green-700 font-medium">มาเรียนวันนี้</div>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">{lateToday}</div>
                        <div className="text-yellow-700 font-medium">มาสายวันนี้</div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">{absentToday}</div>
                        <div className="text-red-700 font-medium">ขาดเรียนวันนี้</div>
                    </div>
                </div>

                {/* อัตราการเข้าเรียนตามห้อง */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">อัตราการเข้าเรียนตามห้อง</h3>
                    <div className="space-y-3">
                        {classes.map(cls => {
                            const classStudents = students.filter(s => s.class === cls).length;
                            const classPresent = attendanceRecords.filter(r => r.class === cls && r.status === 'Present').length;
                            const percentage = classStudents > 0 ? Math.round((classPresent / classStudents) * 100) : 0;

                            return (
                                <div key={cls} className="flex items-center gap-4">
                                    <div className="w-16 text-sm font-medium">{cls}</div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-16 text-sm text-gray-600">{percentage}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* นักเรียนที่มาสายบ่อย */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">นักเรียนที่ต้องติดตาม</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 text-left">รหัสนักเรียน</th>
                                    <th className="px-4 py-3 text-left">ชื่อ-นามสกุล</th>
                                    <th className="px-4 py-3 text-left">ห้องเรียน</th>
                                    <th className="px-4 py-3 text-left">จำนวนครั้งที่มาสาย</th>
                                    <th className="px-4 py-3 text-left">จำนวนครั้งที่ขาด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students
                                    .map(student => ({
                                        ...student,
                                        lateCount: attendanceRecords.filter(r => r.studentId === student.id && r.status === 'Late').length,
                                        absentCount: attendanceRecords.filter(r => r.studentId === student.id && r.status === 'Absent').length
                                    }))
                                    .filter(student => student.lateCount > 0 || student.absentCount > 0)
                                    .sort((a, b) => (b.lateCount + b.absentCount) - (a.lateCount + a.absentCount))
                                    .map(student => (
                                        <tr key={student.id} className="border-b border-gray-200">
                                            <td className="px-4 py-3">{student.studentId}</td>
                                            <td className="px-4 py-3">{student.name}</td>
                                            <td className="px-4 py-3">{student.class}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                                    {student.lateCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                                                    {student.absentCount}
                                                </span>
                                            </td>
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

export default StatisticsPage