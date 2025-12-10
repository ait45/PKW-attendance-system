function Marquee({ text, className }) {
  return (
    <div
      className={`relative flex overflow-hidden whitespace-nowrap ${className}`}
    >
      {/* ชุดที่ 1 */}
      <div className="animate-marquee flex min-w-full shrink-0 items-center py-1/2">
        {/* สั่งให้มันแสดงข้อความซ้ำ 4 รอบ เพื่อแก้ปัญหาข้อความสั้น */}
        <span className="text-xs flex font-medium mx-4">
          {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text}
        </span>
      </div>

      {/* ชุดที่ 2 (ต้องซ้ำเหมือนกันเป๊ะ) */}
      <div className="animate-marquee flex min-w-full shrink-0 items-center py-1/2">
        <span className="text-xs flex font-medium mx-4">
          {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text}
        </span>
      </div>
    </div>
  );
}

export default Marquee;
