import { UserSchema } from "@modules/auth/schemas";
import { Component, Resource, Show, Suspense } from "solid-js";
import Skeleton from "./skeleton";

type ProfileProps = {
  user: Resource<UserSchema | null>;
};

const Profile: Component<ProfileProps> = (props) => {
  function initials() {
    const user = props.user();
    return (user ? user.firstname[0] + user.lastname[0] : "").toUpperCase();
  }

  return (
    <div class="block aspect-square h-full w-[30px]">
      <Suspense fallback={<Skeleton type="round" />}>
        <Show when={props.user()}>
          <figure class="border-full flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-primary">
            <Show
              when={props.user()!.pictureUrl}
              fallback={
                <figcaption class="text-xs font-bold text-white">
                  {initials()}
                </figcaption>
              }
            >
              <img src={props.user()!.pictureUrl!} alt={initials()} />
            </Show>
          </figure>
        </Show>
      </Suspense>
    </div>
  );
};

export default Profile;
