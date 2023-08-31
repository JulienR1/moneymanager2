import { Accessor, Component, JSX, createSignal } from "solid-js";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar, { SidebarLinkProps } from "./components/sidebar";

type LayoutProps = { connected: Accessor<boolean>; children: JSX.Element };

const sidebarLinks = {
  connected: [{ href: "/", icon: { name: "home" }, label: "Tableau de bord" }],
  disconnected: [
    { href: "/login", icon: { name: "login" }, label: "Connexion" },
    { href: "/register", icon: { name: "person" }, label: "S'enregistrer" },
  ],
} satisfies Record<string, SidebarLinkProps[]>;

const Layout: Component<LayoutProps> = (props) => {
  const [sidebarVisible, setSidebarVisible] = createSignal(false);

  const showSidebar = () => setSidebarVisible(true);
  const hideSidebar = () => setSidebarVisible(false);

  const links = () =>
    props.connected() ? sidebarLinks.connected : sidebarLinks.disconnected;

  return (
    <div class="relative flex min-h-[100vh] min-w-[100vw] md:flex-row-reverse">
      <div class="block h-full w-full">
        <Header onEnableSidebar={showSidebar} />
        <main>{props.children}</main>
        <Footer />
      </div>

      <Sidebar
        visible={sidebarVisible()}
        onClose={hideSidebar}
        links={links()}
      />
    </div>
  );
};

export default Layout;
