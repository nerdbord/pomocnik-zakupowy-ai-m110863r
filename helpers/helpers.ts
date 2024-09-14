export function getInitials(name: string) {
  const nameParts = name.split(" ");
  const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  return initials ? initials.toUpperCase() : "U";
}
