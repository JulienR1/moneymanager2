import { Dashboard } from "@/resources/schema";

export function makeSidebarLinks(
  connected: boolean,
  dashboards: Dashboard[],
  selectedDashboard: Dashboard | null,
) {
  if (!connected) {
    return {
      primary: [
        { href: "/login", icon: { name: "login" }, label: "Connexion" },
        { href: "/register", icon: { name: "person" }, label: "S'enregistrer" },
      ],
    };
  }

  const disabled = !selectedDashboard;

  return {
    primary: [
      {
        href: makeLink(selectedDashboard, ""),
        icon: { name: "home" },
        label: "Tableau de bord",
        end: true,
        disabled,
      },
      {
        href: makeLink(selectedDashboard, "/new"),
        label: "Nouvelle transaction",
        icon: { name: "receipt_long" },
        disabled,
      },
    ],
    dashboards: dashboards.map((d) => ({
      href: makeLink(d, ""),
      label: d.label,
      icon: { name: "group" },
    })),
  };
}

function makeLink(dashboard: Dashboard | null, link: string) {
  if (!dashboard) {
    return "#";
  }
  return `/${dashboard.key}${link}`;
}
