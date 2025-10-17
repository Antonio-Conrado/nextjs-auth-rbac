import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { startTransition, useActionState, useEffect } from "react";
import {
  profile,
  profileErrors,
  profileSchema,
} from "@/features/settings/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileAction } from "@/features/settings/actions/profile-action";
import { initialStateDefault } from "@/shared/schemas/api/apiResponse.schema";
import { UserProfile } from "@/features/auth/schemas/profileSchema";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  selectedUserId: number | null;
  data: UserProfile | null | undefined;
  t: (key: string) => string;
};

export default function useUpdateUserProfile({
  selectedUserId,
  data,
  t,
}: Props) {
  const queryClient = useQueryClient();
  const updateProfileWithId = profileAction.bind(null, selectedUserId!);
  const [state, formAction] = useActionState(
    updateProfileWithId,
    initialStateDefault<profileErrors, null>()
  );

  // Handle API response
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } else if (state.type === "error") {
      // Show error message if the update failed
      toast.error(state.message);
    }
  }, [state]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control,
  } = useForm<profile>({
    resolver: zodResolver(profileSchema(t)),
  });

  // Initialize the form fields with the fetched user data when available
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        surname: data.surname,
        email: data.email,
        telephone: data.telephone,
        roleId: data.role.id,
      });
    }
  }, [data, reset]);

  const onSubmit = (data: profile) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  return { handleSubmit, register, errors, control, onSubmit, state };
}
