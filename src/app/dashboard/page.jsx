"use client"
import { useState } from 'react';
import Nav from '../components/Navbar/page';
import Footer from '../components/Footer/page';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { Camera, Users, Settings, Plus, Edit, Trsh2, Save, X, QrCode, GraduationCap, BookOpen, UserRoundCheck, Calendar, BarChart3, UserStar } from 'lucide-react';
import QRScanning from '../components/QRScanning/page';
import StatisticsPage from '../components/Statistics/page';
import SchedulePage from '../components/Schedule/page';
import StudentManagement from '../components/StudentManagement/page';;
import AttendanceCheckPage from '../components/AttendanceCheck/page';



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
        studentId: '',
        name: '',
        class: '',
        phone: '',
        parentPhone: '',
        address: '',
    });
    
    
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
    const handleFormNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    


    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-100">
            <Nav session={session}/>
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