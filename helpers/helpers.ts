export function getInitials(name: string) {
  const nameParts = name.split(" ");
  let initials;
  if (nameParts.length > 1) {
    initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
  } else {
    initials = nameParts[0].charAt(0);
  }
  return initials ? initials.toUpperCase() : "U";
}
