# مسار التمريض | Masar Al-Tamreed
واجهة HTML/CSS/JS + Firebase Authentication + Firestore، مناسبة لـ GitHub Pages.

## قبل التشغيل
1. فعّل Email/Password في Firebase Authentication.
2. حساب Admin يستخدم البريد الحقيقي وكلمة المرور.
3. الطالب/المدرس يستخدم داخليًا: CODE@accounts.masar.local، والواجهة تعرض الكود فقط.
4. أنشئ مستند users/{uid} بعد إنشاء المستخدم في Authentication.
5. انشر Firestore Rules.

## Collections
users, stages, subjects, groups, lectures, exams, examAttempts, files, notifications, leaderboard, activityLogs, settings.

## مهم
لا توجد Firebase Functions ولا Storage في هذه النسخة. إنشاء حسابات Authentication يتم من Firebase Console، لأن إنشاء حسابات مستخدمين آخرين من GitHub Pages وحده ليس عملية إدارية آمنة.
