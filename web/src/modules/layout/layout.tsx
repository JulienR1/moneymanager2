import { Component, JSX, createSignal } from "solid-js";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

type LayoutProps = { children: JSX.Element };

const Layout: Component<LayoutProps> = (props) => {
  const [sidebarVisible, setSidebarVisible] = createSignal(false);

  const showSidebar = () => setSidebarVisible(true);
  const hideSidebar = () => setSidebarVisible(false);

  return (
    <div class="relative flex min-h-[100vh] min-w-[100vw] md:flex-row-reverse">
      <div class="block h-full w-full">
        <Header onEnableSidebar={showSidebar} />
        <main>{props.children}</main>
        <Footer />
      </div>

      <Sidebar visible={sidebarVisible()} onClose={hideSidebar} />
    </div>
  );
};

export default Layout;
