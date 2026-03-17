import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    teacher: Principal;
    comment: string;
    rating: bigint;
    reviewer: Principal;
}
export interface Session {
    id: bigint;
    topic: string;
    subject: string;
    scheduledTime: string;
    googleMeetLink: string;
    teacher: Principal;
    groupId: bigint;
}
export type Time = bigint;
export interface AikyaUser {
    username: string;
    subject: string;
    role: UserRole;
    profileInfo: string;
}
export interface ChatMessage {
    senderUsername: string;
    sender: Principal;
    message: string;
    timestamp: Time;
}
export interface Group {
    id: bigint;
    subject: string;
    learners: Array<Principal>;
    teacher: Principal;
    isActive: boolean;
}
export interface UserProfile {
    username: string;
    subject: string;
    role: UserRole;
    profileInfo: string;
}
export interface Note {
    title: string;
    content: string;
}
export enum UserRole {
    learner = "learner",
    teacher = "teacher"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNote(title: string, content: string): Promise<void>;
    addNotification(notification: string): Promise<void>;
    addReview(teacher: Principal, rating: bigint, comment: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    clearNotifications(): Promise<void>;
    createSession(groupId: bigint, topic: string, scheduledTime: string, googleMeetLink: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getGroup(id: bigint): Promise<Group>;
    getGroupChatMessages(groupId: bigint): Promise<Array<ChatMessage>>;
    getMyGroup(): Promise<Group | null>;
    getMyGroupSessions(): Promise<Array<Session>>;
    getMyUser(): Promise<AikyaUser | null>;
    getNotes(): Promise<Array<Note>>;
    getNotifications(): Promise<Array<string>>;
    getTeacherReviews(teacher: Principal): Promise<Array<Review>>;
    getUser(user: Principal): Promise<AikyaUser | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(username: string, subject: string, role: UserRole, profileInfo: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendChatMessage(groupId: bigint, message: string, senderUsername: string): Promise<void>;
}
