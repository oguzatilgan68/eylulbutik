"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  parentId: z.string().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      ...initialData,
      parentId: initialData?.parentId ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Kategori Adı</label>
        <Input
          {...register("name")}
          className="dark:bg-gray-700 dark:text-white"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <Input
          {...register("slug")}
          className="dark:bg-gray-700 dark:text-white"
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Üst Kategori</label>
        <Input
          {...register("parentId")}
          className="dark:bg-gray-700 dark:text-white"
          placeholder="Opsiyonel"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {initialData ? "Güncelle" : "Oluştur"}
      </Button>
    </form>
  );
};
