import { CreatePollingDto } from './create-polling.dto';
declare const UpdatePollingDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreatePollingDto, "options" | "visibility" | "duration">>>;
export declare class UpdatePollingDto extends UpdatePollingDto_base {
    allowedUserIds?: string[];
}
export {};
