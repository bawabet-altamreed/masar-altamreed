export const ROLES = Object.freeze({
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin"
});

export function isValidRole(role) {
    return Object.values(ROLES).includes(role);
}
