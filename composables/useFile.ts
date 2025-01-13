import { useMutation, useQuery } from "@tanstack/vue-query";

export function useFile(name: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ["file", name.value]),
    queryFn: async () => {
      if (!name.value) {
        return Promise.resolve(
          new URL("../public/user/cat.png", import.meta.url).href,
        );
      }

      const imageUrl = new URL(
        `../public/user/${name.value}.jpg`,
        import.meta.url,
      ).href;

      const response = await fetch(imageUrl);
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("image")) {
          return imageUrl;
        }
      }

      return new URL("../public/user/cat.png", import.meta.url).href;
    },
    enabled: computed(() => name.value !== undefined),
  });
}

export function usePostFile() {
  return useMutation({
    mutationFn: async ({ file, name }: { file: File; name: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const res = await fetch("api/file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data;
    },
  });
}
