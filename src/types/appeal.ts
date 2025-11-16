// Appeal System Types

export type AppealContent = "plan" | "recipe" | "comment" | "recipe_comment" | "group_post";

export type AppealStatus = "pending" | "under_review" | "approved" | "rejected";

export interface Appeal {
  id: string;
  userId: string;
  contentType: AppealContent;
  contentId: string;
  reason: string;
  status: AppealStatus;
  priority: number;
  adminNote?: string;
  resolvedBy?: string;
  resolvedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AppealWithUser extends Appeal {
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    reputationScore: number;
  };
  resolver?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface CreateAppealInput {
  contentType: AppealContent;
  contentId: string;
  reason: string;
}

export interface ResolveAppealInput {
  status: "approved" | "rejected";
  adminNote?: string;
}

export interface AppealListResponse {
  appeals: AppealWithUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AppealStats {
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export const APPEAL_CONTENT_LABELS: Record<AppealContent, string> = {
  plan: "Plan",
  recipe: "Tarif",
  comment: "Yorum",
  recipe_comment: "Tarif Yorumu",
  group_post: "Grup Gönderisi",
};

export const APPEAL_STATUS_LABELS: Record<AppealStatus, string> = {
  pending: "Beklemede",
  under_review: "İnceleniyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export const APPEAL_STATUS_COLORS: Record<AppealStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const MIN_APPEAL_REASON_LENGTH = 20;
export const MAX_APPEAL_REASON_LENGTH = 1000;

export const REPUTATION_BONUS_ON_APPROVAL = 5;
