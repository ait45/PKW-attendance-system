"use client"
import Nav from "../components/Navbar/page";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function StudentForm() {
    const [newStudent, setNewStudent] = useState({
        studentId: "",
        name: "",
        class: "",
        phone: "",
        parentPhone: "",
        address: "",
    });
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
    const [selectedClass, setSelectedClass] = useState("ม.1");
    const [classes] = useState([
        'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'
    ]);
    const [students, setStudents] = useState([]);

    const handleFormNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddStudent = () => {
        setStudents((prev) => [...prev, newStudent]);
        // reset form
        setNewStudent({
            studentId: "",
            name: "",
            class: "",
            phone: "",
            parentPhone: "",
            address: "",
        });
    };

    return (
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
                            name='studentId'
                            value={newStudent.studentId}
                            onChange={handleFormNewStudentChange}
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            type="text"
                            placeholder='ชื่อ-นามสกุล'
                            name='name'
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name='class'
                        >
                            <option value="">เลือกห้องเรียน</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-15">
                            <input
                                type='tel'
                                placeholder='เบอร์โทรนักเรียน'
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                name='phone'
                            />
                            <input
                                type='tel'
                                placeholder='เบอร์โทรผู้ปกครอง'
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                name='parentPhone'
                            />
                            <input
                                type="text"
                                placeholder="ที่อยู่"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name='address'
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
}
