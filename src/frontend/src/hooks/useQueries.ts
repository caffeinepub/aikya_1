import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AikyaUser,
  ChatMessage,
  Group,
  Note,
  Review,
  Session,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

export function useMyUser() {
  const { actor, isFetching } = useActor();
  return useQuery<AikyaUser | null>({
    queryKey: ["myUser"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyGroup() {
  const { actor, isFetching } = useActor();
  return useQuery<Group | null>({
    queryKey: ["myGroup"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyGroup();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyGroupSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<Session[]>({
    queryKey: ["myGroupSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyGroupSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGroupChatMessages(groupId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages", groupId?.toString()],
    queryFn: async () => {
      if (!actor || groupId === undefined) return [];
      return actor.getGroupChatMessages(groupId);
    },
    enabled: !!actor && !isFetching && groupId !== undefined,
    refetchInterval: 5000,
  });
}

export function useTeacherReviews(teacherPrincipal: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["teacherReviews", teacherPrincipal],
    queryFn: async () => {
      if (!actor || !teacherPrincipal) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getTeacherReviews(Principal.fromText(teacherPrincipal));
    },
    enabled: !!actor && !isFetching && !!teacherPrincipal,
  });
}

export function useNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

export function useNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      username: string;
      subject: string;
      role: UserRole;
      profileInfo: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.registerUser(
        data.username,
        data.subject,
        data.role,
        data.profileInfo,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUser"] });
    },
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      groupId: bigint;
      topic: string;
      scheduledTime: string;
      googleMeetLink: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createSession(
        data.groupId,
        data.topic,
        data.scheduledTime,
        data.googleMeetLink,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroupSessions"] });
    },
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      groupId: bigint;
      message: string;
      senderUsername: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.sendChatMessage(
        data.groupId,
        data.message,
        data.senderUsername,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", variables.groupId.toString()],
      });
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      teacherPrincipal: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      await actor.addReview(
        Principal.fromText(data.teacherPrincipal),
        data.rating,
        data.comment,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherReviews"] });
    },
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addNote(data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useClearNotifications() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.clearNotifications();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
