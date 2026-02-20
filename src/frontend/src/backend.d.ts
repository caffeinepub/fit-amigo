import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: bigint;
    title: string;
    likeCount: bigint;
    description: string;
    videoFile: ExternalBlob;
    uploadTimestamp: bigint;
    commentCount: bigint;
    uploaderId: Principal;
}
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    isInternal: boolean;
    quantity: bigint;
    image?: ExternalBlob;
    price: bigint;
}
export type OrderId = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Comment {
    id: bigint;
    userId: Principal;
    text: string;
    timestamp: bigint;
    videoId: bigint;
}
export interface ProductDetails {
    name: string;
    description: string;
    quantity: bigint;
    image?: ExternalBlob;
    price: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    total: bigint;
    userId: UserId;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FoodEntryInput {
    fat: number;
    carbs: number;
    calories: number;
    servingSize: number;
    foodName: string;
    protein: number;
}
export type UserId = Principal;
export interface FoodEntry {
    id: bigint;
    fat: number;
    carbs: number;
    userId: Principal;
    calories: number;
    servingSize: number;
    timestamp: bigint;
    foodName: string;
    protein: number;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface RunningSession {
    duration: bigint;
    userId: Principal;
    distance: number;
    notes?: string;
    timestamp: bigint;
    runId: bigint;
}
export type ProductId = bigint;
export interface Workout {
    weight: bigint;
    reps: bigint;
    sets: bigint;
    exerciseName: string;
}
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(videoId: bigint, text: string): Promise<bigint>;
    addFoodEntry(food: FoodEntryInput): Promise<bigint>;
    addProduct(productDetails: ProductDetails): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteComment(commentId: bigint): Promise<void>;
    deleteFoodEntry(entryId: bigint): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    deleteRunningSession(id: bigint): Promise<void>;
    editFoodEntry(entryId: bigint, food: FoodEntryInput): Promise<void>;
    editProduct(id: ProductId, productDetails: ProductDetails): Promise<void>;
    fetchExternalProducts(): Promise<string>;
    getAllRunningSessions(): Promise<Array<RunningSession>>;
    getAllVideos(): Promise<Array<Video>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getFoodEntry(entryId: bigint): Promise<FoodEntry | null>;
    getOrder(id: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product>;
    getRunningSession(id: bigint): Promise<RunningSession | null>;
    getUserFoodEntries(): Promise<Array<FoodEntry>>;
    getUserFoodEntryCount(): Promise<bigint>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRunningSessions(): Promise<Array<RunningSession>>;
    getVideo(id: bigint): Promise<Video | null>;
    getVideoComments(videoId: bigint): Promise<Array<Comment>>;
    getVideoLikeCount(videoId: bigint): Promise<bigint>;
    getWorkouts(): Promise<Array<Workout>>;
    hasLikedVideo(videoId: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    likeVideo(videoId: bigint): Promise<void>;
    logRunningSession(distance: number, duration: bigint, notes: string | null): Promise<bigint>;
    logWorkout(workout: Workout): Promise<void>;
    placeOrder(shippingAddress: string): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unlikeVideo(videoId: bigint): Promise<void>;
    uploadVideo(title: string, description: string, file: ExternalBlob): Promise<bigint>;
}
