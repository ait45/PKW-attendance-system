"use client"
import React, { useState, useCallback, useRef } from 'react';
import Nav from '../components/Navbar/page';
import Footer from '../components/Footer/page';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { Camera, Users, Settings, Plus, Edit, Trsh2, Save, X, QrCode, GraduationCap, BookOpen, UserRoundCheck, Calendar, BarChart3, UserStar } from 'lucide-react';
import QRScanning from '../components/QRScanning/page';



const StudentAttendanceSystem = () => {
    const [qrData, setQrdata] = useState("");
    const [currentPage, setCurrentPage] = useState('scan');
    const [userRole, setUserRole] = useState("teacher");
    // ข้อมูลนักเรียน
    const [students, setStudents] = useState([
        {
            id: 1,
            studentId: 'STD001',
            name: 'สมชาย ใจดี',
            class: 'ม.6/1',
            grade: 'มัธยมปลาย',
            phone: '081-234-5678',
            parentPhone: '089-876-5432',
            address: '123 หมู่ 1 ต.ในเมือง อ.เมือง จ.นครสวรรค์'
        },
        {
            id: 2,
            studentId: 'STD002',
            name: 'สมหญิง รักเรียน',
            class: 'ม.6/1',
            grade: 'มัธยมปลาย',
            phone: '082-345-6789',
            parentPhone: '088-765-4321',
            address: '456 หมู่ 2 ต.ในเมือง อ.เมือง จ.นครสวรรค์'
        }
    ]);
    // ข้อมูลครู
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            teacherId: 'TCH001',
            name: 'อาจารย์สมศักดิ์ ใจใส',
            subject: 'คณิตศาสตร์',
            phone: '081-111-2222',
            email: 'somsak@school.ac.th'
        }
    ]);
    const [subjects] = useState([
        'คณิตศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'วิทยาศาสตร์', 'สังคมศึกษา', 'ประวัติศาสตร์'
    ]);

    const [classes] = useState([
        'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'
    ]);
    const [attendanceRecords, setAttendanceRecords] = useState([
        {
            id: 1,
            studentId: 1,
            studentName: 'สมชาย ใจดี',
            class: 'ม.6/1',
            checkIn: '07:45',
            date: '2024-03-15',
            status: 'Present',
            subject: 'คณิตศาสตร์',
            period: 1
        },
        {
            id: 2,
            studentId: 2,
            studentName: 'สมหญิง รักเรียน',
            class: 'ม.6/1',
            checkIn: '08:00',
            date: '2024-03-15',
            status: 'Late',
            subject: 'คณิตศาสตร์',
            period: 1
        }
    ]);
    const [periods] = useState([
        { period: 1, time: '08:40-09:30' },
        { period: 2, time: '09:30-10:20' },
        { period: 3, time: '10:20-11:10' },
        { period: 4, time: '11:10-12:00' },
        { period: 5, time: '13:00-13:50' },
        { period: 6, time: '13:50-14:40' },
        { period: 7, time: '14:40-15:30' }
    ]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        studentId: '', name: '', class: '', grade: '', phone: '', parentPhone: '', address: ''
    });
    const handleChange = useCallback((field) => (e) => {
        setNewStudent(prev => ({ ...prev, [field]: e.target.value }));
    }, []); // ✅ ไม่มี dependency
    const [selectedClass, setSelectedClass] = useState("ม.1");
    const [selectedSubject, setSelectedSubject] = useState('คณิตศาสตร์');
    const [selectedPeriod, setSelectedPeriod] = useState(1);
    const handleQRScan = (qrData) => {
        const student = students.find(s => s.studentId === qrData);
        if (student) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            const dateString = now.toLocaleDateString('en-CA');

            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const isLate = currentHour > 8 || (currentMinute === 8 && currentMinute > 0);

            const existingRecord = attendanceRecords.find(record =>
                record.studentId === student.id &&
                record.date === dateString &&
                record.subject === selectedSubject &&
                record.period === selectedPeriod
            );
            if (!existingRecord) {
                const newRecord = {
                    id: attendanceRecords.length + 1,
                    studentId: student.id,
                    studentName: student.name,
                    class: student.class,
                    checkIn: timeString,
                    date: dateString,
                    status: isLate ? 'Late' : 'Present',
                    subject: selectedSubject,
                    period: selectedPeriod
                };
                setAttendanceRecords(prev => [...prev, newRecord]);
                Swal.fire({
                    title: 'บันทึกการเข้าเรียนสำเร็จ!',
                    text: `${student.name} - ${student.class}\n${selectedSubject} คาบที่ ${selectedPeriod}\nสถานะ: ${isLate ? 'มาสาย' : 'มาตรงเวลา'}`,
                    icon: isLate ? 'warning' : 'success'
                });
            } else {
                Swal.fire({
                    title: 'บันทึกการเข้าเรียนแล้ว',
                    text: `${student.name} ได้บันทึกการเข้าเรียนสำหรับคาบนี้แล้ว`,
                    icon: 'info'
                });
            }
        } else {
            Swal.fire({
                title: 'ไม่พบข้อมูลนักเรียน',
                text: 'รหัสนักเรียนไม่ถูกต้อง',
                icon: 'error'
            });
        }
    };
    // ฟังก์ชันจัดการนักเรียน
    const handleAddStudent = async () => {
        if (!newStudent.studentId || !newStudent.name || !newStudent.class) {
            Swal.fire({
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'รหัสนักเรียน ชื่อ-นามสกุล และห้องเรียนเป็นข้อมูลที่จำเป็น',
                icon: 'warning',
                width: '80%'
            });
            return;
        }

        // ตรวจสอบรหัสนักเรียนซ้ำ
        if (students.some(s => s.studentId === newStudent.studentId)) {
            Swal.fire({
                title: 'รหัสนักเรียนซ้ำ',
                text: 'กรุณาใช้รหัสนักเรียนอื่น',
                icon: 'error'
            });
            return;
        }

        const student = {
            id: students.length + 1,
            ...newStudent
        };

        setStudents([...students, student]);
        setNewStudent({ studentId: '', name: '', class: '', grade: '', phone: '', parentPhone: '', address: '' });

        Swal.fire({
            title: 'เพิ่มนักเรียนสำเร็จ!',
            icon: 'success'
        });
    };

    const handleEditStudent = (student) => {
        setEditingStudent({ ...student });
    };

    const handleUpdateStudent = async () => {
        setStudents(students.map(s =>
            s.id === editingStudent.id ? editingStudent : s
        ));
        setEditingStudent(null);

        Swal.fire({
            title: 'อัพเดทข้อมูลสำเร็จ!',
            icon: 'success'
        });
    };
    const handleDeleteStudent = async (id) => {
        const result = await Swal.fire({
            title: 'ต้องการลบนักเรียนนี้?',
            text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            setStudents(students.filter(s => s.id !== id));
            Swal.fire({
                title: 'ลบนักเรียนสำเร็จ!',
                icon: 'success'
            });
        }
    };
    // หน้าเช็คชื่อ
    const AttendanceCheckPage = () => (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className='flex items-center justify-center mb-6'>
                    <UserRoundCheck width={30} height={30} />
                    <h2 className="text-2xl font-bold text-gray-800 text-center ml-2">เช็คชื่อนักเรียน</h2>
                </div>


                {/* ตั้งค่าการเช็คชื่อ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ห้องเรียน</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">วิชา</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">คาบเรียน</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {periods.map(p => (
                                <option key={p.period} value={p.period}>คาบ {p.period} ({p.time})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-center">
                    <QRScanning QrCodeData={(value) => setQrdata(value)} />
                </div>
            </div>
        </div>
    );
    // หน้าจัดการนักเรียน
    const StudentManagement = () => (
        <div className="max-w-7xl mx-auto p-6">
            <div className='bg-white rounded-lg shadow-lg p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>จัดการข้อมูลนักเรียน</h2>
                {/* ฟอร์มเพิ่มนักเรียน */}
                <div className='mb-8 p-6 bg-gray-50 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-4'>เพิ่มนักเรียนใหม่</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                        <input
                            type="text"
                            placeholder='รหัสนักเรียน'
                            value={newStudent.studentId}
                            onChange={handleChange('studentId')}
                            className='px-4 py-2 border border-gra-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            type="text"
                            placeholder='ชื่อ-นามสกุล'
                            value={newStudent.name}
                            onChange={handleChange('name')}
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <select
                            value={newStudent.class}
                            onChange={handleChange('class')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">เลือกห้องเรียน</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-15">
                            <input
                                value={newStudent.phone}
                                type='tel'
                                placeholder='เบอร์โทรนักเรียน'
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                onChange={handleChange('phone')}
                            />
                            <input
                                value={newStudent.parentPhone}
                                type='tel'
                                placeholder='เบอร์โทรผู้ปกครอง'
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                onChange={handleChange('parentPhone')}
                            />
                            <input
                                type="text"
                                placeholder="ที่อยู่"
                                value={newStudent.address}
                                onChange={handleChange('address')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleAddStudent}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            เพิ่มนักเรียน
                        </button>
                    </div>
                    {/* ตารางนักเรียน */}
                    <div className='overflow-x-auto'>
                        <table className='w-full table-auto'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='px-4 py-3 text-left'>รหัสนักเรียน</th>
                                    <th className='px-4 py-3 text-left'>ชื่อ-นามสกุล</th>
                                    <th className='px-4 py-3 text-left'>ห้องเรียน</th>
                                    <th className='px-4 py-3 text-left'>วิชา</th>
                                    <th className='px-4 py-3 text-left'>คาบ</th>
                                    <th className='px-4 py-3 text-left'>เวลาเข้าเรียน</th>
                                    <th className='px-4 py-3 text-left'>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords
                                    .filter(record => !selectedClass || record.class === selectedClass)
                                    .filter(record => !selectedSubject || record.subject === selectedClass)
                                    .map((record) => {
                                        <tr key={record.id} className='border-b border-gray-200'>
                                            <td className='px-4 py-3'>{new Date(record.date).toLocaleDateString('th-TH')}</td>
                                            <td className='px-4 py-3'>
                                                {students.find(s => s.id === record.studentId)?.studentId}
                                            </td>
                                            <td className='px-4 py-3'>{record.studentName}</td>
                                            <td className='px-4 py-3'>{record.class}</td>
                                            <td className='px-4 py-3'>{record.subject}</td>
                                            <td className='px-4 py-3'>{record.period}</td>
                                            <td className='px-4 py-3'>{record.checkIn}</td>
                                            <td className='px-4 py-3'>
                                                <span className={`
                                                px-2 py-1 rounded-full text-sm ${record.status === 'Present'
                                                        ? 'bg-green-100 text-green-800'
                                                        : record.status === 'Late'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : record.status === 'Sick'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {record.status === 'Present' ? 'มาตรงเวลา'
                                                        : record.status === 'Late' ? 'มาสาย'
                                                            : record.status === 'Sick' ? 'ลาป่วย'
                                                                : 'ขาดเรียน'
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
    // หน้าตารางเรียน
    const SchedulePage = () => (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">ตารางเรียน</h2>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-3">คาบ/วัน</th>
                                <th className="border border-gray-300 px-4 py-3">จันทร์</th>
                                <th className="border border-gray-300 px-4 py-3">อังคาร</th>
                                <th className="border border-gray-300 px-4 py-3">พุธ</th>
                                <th className="border border-gray-300 px-4 py-3">พฤหัสบดี</th>
                                <th className="border border-gray-300 px-4 py-3">ศุกร์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periods.map((period) => (
                                <tr key={period.period}>
                                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium">
                                        คาบ {period.period}<br />
                                        <span className="text-sm text-gray-600">{period.time}</span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3">คณิตศาสตร์</td>
                                    <td className="border border-gray-300 px-4 py-3">ภาษาไทย</td>
                                    <td className="border border-gray-300 px-4 py-3">ภาษาอังกฤษ</td>
                                    <td className="border border-gray-300 px-4 py-3">วิทยาศาสตร์</td>
                                    <td className="border border-gray-300 px-4 py-3">สังคมศึกษา</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ข้อมูลครู */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">ครูประจำวิชา</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {subjects.slice(0, 6).map((subject, index) => (
                            <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-800">{subject}</div>
                                <div className="text-sm text-gray-600">อาจารย์สมศักดิ์ ใจใส</div>
                                <div className="text-xs text-gray-500">somsak@school.ac.th</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    // หน้าสถิติ
    const StatisticsPage = () => {
        const totalStudents = students.length;
        const todayRecords = attendanceRecords.filter(r => r.date === new Date().toLocaleDateString('en-CA'));
        const presentToday = todayRecords.filter(r => r.status === 'Present').length;
        const lateToday = todayRecords.filter(r => r.status === 'Late').length;
        const absentToday = totalStudents - presentToday - lateToday;

        return (
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
    };
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-100">
            <Nav />
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <GraduationCap size={32} className="text-blue-600" />
                            <div className="text-sm font-bold text-gray-800">ระบบเช็คชื่อโรงเรียน</div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage('scan')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${currentPage === 'scan'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <QrCode size={20} />
                                <p className='hidden md:inline'>เช็คชื่อ</p>
                            </button>
                            <button
                                onClick={() => setCurrentPage('students')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${currentPage === 'students'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Users size={20} />
                                <p className='hidden md:inline'>นักเรียน</p>
                            </button>
                            <button
                                onClick={() => setCurrentPage('schedule')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${currentPage === 'schedule'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Calendar size={20} />
                                <p className='hidden md:inline'>ตารางเรียน</p>
                            </button>
                            <button
                                onClick={() => setCurrentPage('reports')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${currentPage === 'reports'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <BookOpen size={20} />
                                <p className='hidden md:inline'>รายงาน</p>
                            </button>
                            <button
                                onClick={() => setCurrentPage('statistics')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${currentPage === 'statistics'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <BarChart3 size={20} />
                                <p className='hidden md:inline'>สถิติ</p>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className='py-8'>

                {currentPage === 'scan' && <AttendanceCheckPage />}
                {currentPage === 'students' && <StudentManagement />}
                {currentPage === 'schedule' && <SchedulePage />}
                {currentPage === 'statistics' && <StatisticsPage />}

            </main>
            <Footer />
        </div>
    );

};

export default StudentAttendanceSystem