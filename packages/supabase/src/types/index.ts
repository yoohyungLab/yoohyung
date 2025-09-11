export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    updated_at?: string;
                };
            };
            tests: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
