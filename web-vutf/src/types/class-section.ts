export interface ClassSection {
    section_id: number;
    section_name: string;
    academic_year: number;
    term: string;
    created_at?: string;
    // อาจจะมี students count ถ้า backend ส่งมา แต่เบื้องต้นเอาเท่าที่มี
}

export interface SectionFilter {
    page: number;
    limit: number;
    search?: string;
    academic_year?: number;
    term?: string;
}