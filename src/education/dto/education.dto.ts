export class CreateEducationDto{
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    grade?: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent?: boolean;
} 