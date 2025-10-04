export declare class PollOptionDto {
    text: string;
}
export declare class CreatePollingDto {
    title: string;
    description: string;
    options: PollOptionDto[];
    visibility: 'public' | 'private';
    duration: number;
    allowedUserIds?: string[];
}
