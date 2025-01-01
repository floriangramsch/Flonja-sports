import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { CategoryTypes } from "~/utils/types";

export default function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/category");
      if (!response.ok) throw new Error("Fehler beim Abrufen der category");
      return response.json();
    },
  });
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      category_id,
      category_type,
    }: {
      name: string;
      category_id: number;
      category_type: CategoryTypes;
    }) => {
      if (category_id) {
        const response = await fetch("/api/category", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id,
            name,
            category_type
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update category");
        }
      } else {
        throw new Error("Failed to update category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category_id: number) => {
      if (category_id) {
        const response = await fetch("/api/category", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }
      } else {
        throw new Error("Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategoryName: string) => {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newCategory: newCategoryName,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
}
