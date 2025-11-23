/**
 * Topic Icons
 * Canonical mapping of law topics to their corresponding icons
 */

import {
  Bus,
  Heart,
  RoadHorizon,
  FirstAid,
  Briefcase,
  GraduationCap,
  LockKey,
  Leaf,
  Shield,
  Eye,
  Recycle,
  Buildings,
} from "@phosphor-icons/react";

export const topicIcons: Record<
  string,
  React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>
> = {
  Transporte: Bus,
  Inclusão: Heart,
  Mobilidade: RoadHorizon,
  Saúde: FirstAid,
  "Serviço Público": Briefcase,
  Educação: GraduationCap,
  Privacidade: LockKey,
  "Meio Ambiente": Leaf,
  Segurança: Shield,
  Tecnologia: Eye,
  Sustentabilidade: Recycle,
  Urbanismo: Buildings,
  Transparência: Eye,
};
