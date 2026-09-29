import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import { isAxiosError } from "axios";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/services/api";
import type { UserRole } from "@/types";

interface ProfileModalProps {
  onClose: () => void;
  onProfileUpdated: () => Promise<void>;
}

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  mustChangePassword: boolean;
  availabilities: {
    hour: string;
  }[];
}

export function ProfileModal({ onClose, onProfileUpdated }: ProfileModalProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availabilities, setAvailabilities] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarError, setAvatarError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await api.get<ProfileResponse>("/users/me", {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setProfile(response.data);

        setAvailabilities(
          response.data.role === "TECHNICIAN"
            ? (response.data.availabilities ?? []).map((availability) =>
                typeof availability === "string"
                  ? availability
                  : availability.hour,
              )
            : [],
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Erro ao buscar perfil:", error);
        setProfile(null);
        setAvailabilities([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAvailability(false);
        }
      }
    };

    void loadProfile();

    return () => {
      controller.abort();
    };
  }, [userId]);

  if (!user) return null;

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError("");

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.patch("/users/avatar", formData);

      await onProfileUpdated();

      const response = await api.get<ProfileResponse>("/users/me");
      setProfile(response.data);
    } catch (error) {
      setAvatarError(
        isAxiosError(error)
          ? (error.response?.data?.message ??
              "Não foi possível atualizar a foto.")
          : "Não foi possível atualizar a foto.",
      );
    } finally {
      setIsUploadingAvatar(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user.avatarUrl) return;

    setAvatarError("");
    setIsDeletingAvatar(true);

    try {
      await api.delete("/users/avatar");
      window.location.reload();
    } catch (error) {
      setAvatarError(
        isAxiosError(error)
          ? (error.response?.data?.message ??
              "Não foi possível excluir a foto.")
          : "Não foi possível excluir a foto.",
      );
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Preencha a senha atual e a nova senha.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.patch("/users/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
      setPasswordSuccess("Senha alterada com sucesso.");
    } catch (error) {
      setPasswordError(
        isAxiosError(error)
          ? (error.response?.data?.message ??
              "Não foi possível alterar a senha.")
          : "Não foi possível alterar a senha.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="flex max-h-[96vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-gray-300 bg-gray-200 shadow-xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-300 px-8 py-6">
          <h2
            id="profile-title"
            className="text-lg font-semibold text-gray-800"
          >
            Perfil
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar perfil"
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <X size={21} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 px-8 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100">
                {avatarPreview || profile?.avatarUrl ? (
                  <img
                    src={
                      avatarPreview ??
                      `${import.meta.env.VITE_API_URL}/files/${profile?.avatarUrl}`
                    }
                    alt={`Foto de ${profile?.name ?? user.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-sky-700">
                    {profile?.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar || isDeletingAvatar}
                className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImagePlus size={17} />
                {isUploadingAvatar ? "Enviando..." : "Nova imagem"}
              </button>

              {(avatarPreview || profile?.avatarUrl) && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  disabled={isUploadingAvatar || isDeletingAvatar}
                  aria-label="Excluir foto de perfil"
                  title="Excluir foto"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-200 text-red-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>

            {avatarError && (
              <p className="-mt-4 text-xs text-red-600">{avatarError}</p>
            )}

            <div className="flex flex-col gap-5">
              <Input
                label="Nome"
                value={user.name}
                readOnly
                className="bg-transparent text-lg text-gray-800 read-only:cursor-default"
              />

              <Input
                label="E-mail"
                type="email"
                value={user.email}
                readOnly
                className="bg-transparent text-lg text-gray-800 read-only:cursor-default"
              />
            </div>

            <div className="flex flex-col gap-3">
              {!isEditingPassword ? (
                <div className="flex items-end gap-3">
                  <div className="min-w-0 flex-1">
                    <label className="mb-1 block text-xxs font-bold uppercase tracking-wider text-gray-500">
                      Senha
                    </label>
                    <div className="flex h-11 items-center border-b border-gray-300 text-lg tracking-[0.2em] text-gray-800">
                      ••••••
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError("");
                      setPasswordSuccess("");
                      setIsEditingPassword(true);
                    }}
                    className="mb-2 rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300"
                  >
                    Alterar
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    label="Senha atual"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    error={passwordError}
                  />

                  <Input
                    label="Nova senha"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setPasswordError("");
                      }}
                      disabled={isChangingPassword}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isChangingPassword ? "Alterando..." : "Atualizar senha"}
                    </button>
                  </div>
                </>
              )}

              {passwordSuccess && (
                <p className="text-xs text-green-600">{passwordSuccess}</p>
              )}
            </div>
          </div>

          <div className="border-y border-gray-300 px-8 py-6">
            <h3 className="text-base font-semibold text-gray-800">
              Disponibilidade
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Horários de atendimento definidos pelo admin
            </p>

            {isLoadingAvailability ? (
              <p className="mt-4 text-sm text-gray-400">
                Carregando horários...
              </p>
            ) : availabilities.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {availabilities.map((hour) => (
                  <div
                    key={hour}
                    className="flex min-w-16 items-center justify-center rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-gray-500"
                  >
                    {hour}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Nenhum horário disponível.
              </p>
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-gray-200 px-8 py-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-[#202124] px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
          >
            Salvar
          </button>
        </footer>
      </section>
    </div>
  );
}
