// types/player.ts
export type PlayerProfile = {
  id: string; // UUID v4
  name: string; // Tên hiển thị
  avatarColor: string;
  createdAt: string; // ISO Date
  totalGames: number;
};

export interface PlayerStats {
  player: PlayerProfile;
  totalGames: number;
  completedGames: number;
  totalTime: number;
  winRate: number;
  notes?: string;
  highlights?: string[];
}

export type PlayerHighlight = {
  id: string;
  name: string;
  highlights: string[];
};
