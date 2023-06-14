import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import './ImageList.scss';
import { Image, UnsplashImage } from '../../types/types';

export const ImageList: React.FC = () => {

    const [query, setQuery] = useState('');
    const [images, setImages] = useState<Image[]>([]);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const apiKey = import.meta.env.VITE_API_KEY;
    const aspectRatio = 'widescreen';
    const orientation = 'landscape';
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${apiKey}&aspect_ratio=${aspectRatio}&orientation=${orientation}`;

    const searchImages = async () => {
        try {
            setIsLoading(true);
            setHasError(false);
            const response: AxiosResponse<{ results: UnsplashImage[] }> = await axios.get(url);
            const data = response.data.results;
            const imageResults: Image[] = data.map((result: UnsplashImage) => ({
                id: result.id,
                description: result.description,
                url: result.urls.regular,
            }));
            setImages(imageResults);
        } catch (error) {
            console.error(error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredImages = images.filter((image) => image.description);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchImages();
        }
    };

    const openModal = (image: Image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const downloadImage = (image: Image) => {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `image_${image.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="main--container">
            <h2>IMAGE SEARCH</h2>
            <div className="input--container">
                <input
                    type="text"
                    placeholder="Search images"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={searchImages}>Search</button>
            </div>
            <div className="image--grid">
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : hasError ? (
                    <h1>Error: Image not found.</h1>
                ) : filteredImages.length > 0 ? (
                    filteredImages.map((image) => (
                        <div key={image.id} onClick={() => openModal(image)}>
                            <img src={image.url} alt={image.description || ''} />
                            <p>{image.description}</p>
                        </div>
                    ))
                ) : (
                    <h1>No images found.</h1>
                )}
                {selectedImage && (
                    <div className="modal">
                        <div className="modal--content">
                            <img src={selectedImage.url} alt={selectedImage.description || ''} />
                        </div>
                        <div className="modal--actions">
                            <span className="close" onClick={closeModal}>
                                X
                            </span>
                            <button onClick={() => downloadImage(selectedImage)}>Download</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
