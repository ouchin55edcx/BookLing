import booksData from '@/assets/data/books.json';
import categoriesData from '@/assets/data/categories.json';
import { BOOK_ASSETS } from '@/constants/assets';

export interface Chapter {
    id: string;
    title: string;
    content: string;
    image: any;
}

export interface Book {
    id: string;
    title: string;
    category: string;
    image: any;
    description: string;
    chapters: Chapter[];
}

export const fetchCategories = async (): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return categoriesData;
};

export const fetchBooks = async (): Promise<Book[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return (booksData as any[]).map(book => ({
        ...book,
        image: BOOK_ASSETS[book.image] || book.image,
        chapters: book.chapters.map((chapter: any) => ({
            ...chapter,
            image: BOOK_ASSETS[chapter.image] || chapter.image
        }))
    }));
};

export const fetchBookById = async (id: string): Promise<Book | undefined> => {
    const books = await fetchBooks();
    return books.find(b => b.id === id);
};
