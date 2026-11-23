export function accountDestination(user: {
  role: string;
  profileComplete?: boolean;
  accountCategory?:string|null;
}) {
  if (user.role === "ADMIN") return "/admin-dashboard";
  if (user.role === "CAREGIVER") return "/caregiver-dashboard";
  if(user.profileComplete===true&&["CARE_HOME","CARE_AGENCY"].includes(user.accountCategory??""))return "/care-seeker-dashboard/organisation";
  return user.profileComplete === true
    ? "/care-seeker-dashboard"
    : "/care-seeker-dashboard/my-profile";
}
