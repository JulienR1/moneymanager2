import { Accessor, Component, JSX, createSignal } from "solid-js";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Sidebar, SidebarLinkProps } from "./components/sidebar";

type LayoutProps = {
  links: Accessor<{
    primary: Array<SidebarLinkProps>;
    dashboards?: Array<SidebarLinkProps>;
  }>;
  children: JSX.Element;
};

export const Layout: Component<LayoutProps> = (props) => {
  const [sidebarVisible, setSidebarVisible] = createSignal(false);

  const showSidebar = () => setSidebarVisible(true);
  const hideSidebar = () => setSidebarVisible(false);

  return (
    <div class="w-100% relative flex min-h-[100vh] bg-gray-50 md:flex-row-reverse">
      <div class="block h-full w-full">
        <Header onEnableSidebar={showSidebar} />
        <main>{props.children}</main>
        <Footer />
      </div>

      <Sidebar
        onClose={hideSidebar}
        visible={sidebarVisible()}
        links={() => props.links().primary}
        dashboardsLinks={() => props.links().dashboards ?? []}
      />
    </div>
  );
};
