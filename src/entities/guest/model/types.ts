export interface Guest {
    id: number;
    fullName: string;
    photo: string;
    category1: string;
    category2: string;
    color: string;
    shortDescription: string;
    fullDescription: string;
    specialNotes?: string;
}