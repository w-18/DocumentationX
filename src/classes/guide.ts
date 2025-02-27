import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { toHTML } from "@/functions/markdown-parser"

export type GuideField = {
    field_name: string;
    field_value: string;
    field_type: "none" | "note" | "danger" | "warning";
    field_notation: //define a type here which means, if field_type === "none", this will be null. else this will be string
};

export class Guides {
    private sanitizeInput(input: string): string {
        const window = new JSDOM('').window;
        const purify = DOMPurify(window);
    
        return purify.sanitize(input, {
            ALLOWED_TAGS: [
                "code", "br", "strong", "em", "u", "del", "h1", "h2", "h3", 
                "blockquote", "pre", "span"
            ],
            ALLOWED_ATTR: ["class"],
        });
    }

    public async create({
        title,
        description,
        fields
    }: {
        title: string;
        description: string;
        fields: GuideField[];
    }): Promise<string> {
        title = toHTML(title)
        description = toHTML(description)
        title = this.sanitizeInput(title);
        description = this.sanitizeInput(description);

        return `${title} <br> ${description}`

        



    }
}
