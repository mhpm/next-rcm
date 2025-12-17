import { MemberTableData, MemberWithMinistries } from "@/app/(authenticated)/members/types/member";

// Formateo de fecha estable (evita dependencias de locale/zonas horarias)
export const formatDate = (value?: string | Date | null): string => {
  if (!value) return "N/A";
  const d = new Date(value);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Función para transformar Member a formato de tabla
export const transformMemberToTableData = (
  member: MemberWithMinistries
): MemberTableData => ({
  id: member.id,
  firstName: member.firstName,
  lastName: member.lastName,
  email: member.email,
  phone: member.phone || "N/A",
  role: member.role,
  notes: member.notes || "N/A",
  address: `${member.street || ""}, ${member.city || ""}, ${
    member.state || ""
  }, ${member.country || ""}`,
  ministries: member.ministries
    ? member.ministries
        .map((m: MemberWithMinistries) => m.ministry?.name)
        .filter(Boolean)
        .join(", ")
    : "N/A",
  birthDate: member.birthDate ? formatDate(member.birthDate) : "N/A",
  baptismDate: member.baptismDate ? formatDate(member.baptismDate) : "N/A",
  raw_birthDate: member.birthDate,
  raw_baptismDate: member.baptismDate,
});
