import type { Tags } from './tags';
import type { Iso8601DateString } from './datetime';

export type PostMetadata = {
    href?: string; // desired URL, if not provided, will be generated from the title
    title: string; // title of the post
    description: string; // description of the post
    author?: string; // author of the post, will default to Cody Nhan Pham
    image?: string; // thumbnail image URL
    imageAlt?: string; // alt text for the image
    tags?: Tags[]; // tags / keywords for the post
    createdAt: Iso8601DateString; // date the post was created
    updatedAt: Iso8601DateString; // date the post was last updated
    layout?: string; // layout to use for the post
}
