import { esc } from "./ui.js";
export function shell(role,title,body){
 const links=role==="student"?[
 ["لوحة التحكم","/student/dashboard.html"],["الجدول","/student/schedule.html"],["المحاضرات","/student/lectures.html"],["الاختبارات","/student/exams.html"],["الترتيب","/student/leaderboard.html"],["الملف الشخصي","/student/profile.html"]
 ]:role==="teacher"?[
 ["لوحة التحكم","/teacher/dashboard.html"],["المحاضرات","/teacher/lectures.html"],["الجدول","/teacher/schedule.html"],["الطلاب","/teacher/students.html"],["الملف الشخصي","/teacher/profile.html"]
 ]:[
 ["لوحة التحكم","/admin/dashboard.html"],["الطلاب","/admin/students.html"],["المدرسون","/admin/teachers.html"],["المحاضرات","/admin/lectures.html"],["الاختبارات","/admin/exams.html"],["الإعدادات","/admin/settings.html"]
 ];
 return `<header class="top"><a class="brand" href="/index.html">مسار التمريض</a><span>${esc(title)}</span><button id="logoutBtn" class="btn danger">خروج</button></header>
 <div class="app"><aside>${links.map(([n,h])=>`<a href="${h}">${n}</a>`).join("")}</aside><main>${body}</main></div>`;
}