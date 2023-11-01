import * as pkg from "@/../package.json";

export const Version = () => {
  return (
    <div class="absolute bottom-1 w-full pr-2">
      <p class="text-right text-xxs text-white opacity-60 md:text-sm">
        v{pkg.version}
      </p>
    </div>
  );
};
