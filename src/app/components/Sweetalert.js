import Swal from "sweetalert2";

export default function ShowAlert({ title, text, icon, timer }) {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: timer || 3000,
    width: "75%",
  });
}
