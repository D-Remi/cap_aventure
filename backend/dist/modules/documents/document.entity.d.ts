import { Child } from '../children/child.entity';
import { User } from '../users/user.entity';
export declare class Document {
    id: number;
    child_id: number;
    user_id: number;
    child: Child;
    user: User;
    type: string;
    nom: string;
    filename: string;
    data: string;
    mimetype: string;
    taille: number;
    valide: boolean;
    note_admin: string;
    created_at: Date;
}
