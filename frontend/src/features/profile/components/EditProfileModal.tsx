import { useAuthStore } from "@/features/auth/useAuthStore";
import { useUpdateProfle } from "../profile.hooks";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../profile.schema";
import { useForm } from "react-hook-form";
import { api } from "@/api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SubmitUpdateProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

function EditProfileModal() {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfle();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const onSubmit = async (values: SubmitUpdateProfile) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== "" && value !== undefined,
      ),
    );
    if (Object.keys(filteredValues).length === 0) {
      setOpen(false);
      return;
    }

    updateProfile(filteredValues, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/uploads/avatar", formData);
      form.setValue("avatarUrl", data.url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                  {form.watch("avatarUrl") ? (
                    <img
                      src={`http://localhost:3000${form.watch("avatarUrl")}`}
                      className="w-full h-full object-cover "
                      alt="Фотография профиля"
                    />
                  ) : (
                    <span>+</span>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
              <span className="text-xs text-slate-500">
                Нажмите, чтобы сменить фотографию
              </span>
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileModal;
