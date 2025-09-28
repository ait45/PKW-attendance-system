export default function Day() {
    const today = new Date();
    const dates = ["อาทิตย์", "จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"];
    const months = [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ];
    const day = today.getDate();
    const date = dates[today.getDay()]  ;
    const month = months[today.getMonth()];
    const year = today.getFullYear() + 543;

    return `วัน${date} ที่ ${day} ${month} ${year}`;
}
