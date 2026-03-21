import { Child } from '../children/child.entity';
import { User } from '../users/user.entity';
export type DocumentType = 'fiche_sanitaire' | 'autorisation' | 'assurance' | 'autre';
export declare class Document {
    id: number;
    child: Child;
    user: User;
    type: DocumentType;
    filename: string;
    original_name: string;
    size: number;
    url: string;
    created_at: Date;
}
