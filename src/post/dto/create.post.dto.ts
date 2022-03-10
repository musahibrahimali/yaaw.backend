export class CreatePostDto{
    title: string;
    content: string;
    images?: string[] | string;
    videos?: string[] | string;
    userId: string;
}