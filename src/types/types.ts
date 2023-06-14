export interface Image {
    id: string;
    description: string | null;
    url: string;
}

export interface UnsplashImage {
    id: string;
    description: string | null;
    urls: {
        regular: string;
    };
}
