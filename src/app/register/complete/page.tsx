"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  User,
  Briefcase,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/logo-lei.png";
import { createClient } from "@/supabase/client";
import { toast } from "sonner";
import type { UserRole, ProfileData } from "@/types/user.types";

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    userRole: "",
    city: "",
    state: "",
    country: "Brasil",
    occupation: "",
    birthDate: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile && profile.city) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const handleNext = () => {
    if (step === 1 && !profileData.userRole) {
      setError("Por favor, selecione uma opção");
      return;
    }
    if (step === 2 && (!profileData.city || !profileData.state)) {
      setError("Por favor, preencha cidade e estado");
      return;
    }
    if (step === 3 && (!profileData.occupation || !profileData.birthDate)) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          user_role: profileData.userRole,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          occupation: profileData.occupation,
          birth_date: profileData.birthDate,
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      toast.success("Perfil atualizado com sucesso!");
      router.push("/");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Bem-vindo!</CardTitle>
              <CardDescription>
                Você é servidor público ou cidadão comum?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button
                  variant={
                    profileData.userRole === "USER" ? "default" : "outline"
                  }
                  className="h-20 text-lg"
                  onClick={() =>
                    setProfileData({ ...profileData, userRole: "USER" })
                  }
                >
                  <User size={24} weight="regular" className="mr-2" />
                  Cidadão Comum
                </Button>

                <Button
                  variant={
                    profileData.userRole === "GOVERNMENT_WORKER"
                      ? "default"
                      : "outline"
                  }
                  className="h-20 text-lg"
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      userRole: "GOVERNMENT_WORKER",
                    })
                  }
                >
                  <Briefcase size={24} weight="regular" className="mr-2" />
                  Servidor Público
                </Button>
              </div>
            </CardContent>
          </>
        );

      case 2:
        return (
          <>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Onde você mora?
              </CardTitle>
              <CardDescription>
                Essas informações nos ajudam a personalizar sua experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="text-sm font-medium leading-none"
                >
                  Cidade
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    weight="regular"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="city"
                    type="text"
                    placeholder="São Paulo"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm font-medium leading-none"
                >
                  Estado
                </label>
                <Input
                  id="state"
                  type="text"
                  placeholder="SP"
                  value={profileData.state}
                  onChange={(e) =>
                    setProfileData({ ...profileData, state: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="text-sm font-medium leading-none"
                >
                  País
                </label>
                <Input
                  id="country"
                  type="text"
                  value={profileData.country}
                  onChange={(e) =>
                    setProfileData({ ...profileData, country: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
          </>
        );

      case 3:
        return (
          <>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Quase lá!</CardTitle>
              <CardDescription>
                Conte-nos um pouco mais sobre você
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="occupation"
                  className="text-sm font-medium leading-none"
                >
                  Profissão
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    weight="regular"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Ex: Engenheiro, Professor, Estudante"
                    value={profileData.occupation}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        occupation: e.target.value,
                      })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="text-sm font-medium leading-none"
                >
                  Data de nascimento
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      birthDate: e.target.value,
                    })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-background">
              <Image
                src={Logo}
                alt="Logo CacaLei"
                fill
                sizes="64px"
                className="object-cover transition duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Passo {step} de 3</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          {renderStep()}

          <div className="flex gap-3 px-6 pb-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft size={18} weight="regular" />
                Voltar
              </Button>
            )}

            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Próximo
                <ArrowRight size={18} weight="regular" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 gap-2"
              >
                <CheckCircle size={18} weight="regular" />
                {isLoading ? "Finalizando..." : "Finalizar"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
