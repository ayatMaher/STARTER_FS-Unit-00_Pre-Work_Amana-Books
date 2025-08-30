// src/app/components/BookGrid.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import BookListItem from './BookListItem';
import Pagination from './Pagination';

interface BookGridProps {
  books: Book[];
  onAddToCart?: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onAddToCart}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);

  const featuredBooks = useMemo(() => books.filter(book => book.featured), [books]);

  const booksPerPage = 4;
  const totalFeaturedPages = Math.ceil(featuredBooks.length / booksPerPage);

  const currentFeaturedBooks = useMemo(() => {
    const startIndex = featuredCarouselIndex * booksPerPage;
    return featuredBooks.slice(startIndex, startIndex + booksPerPage);
  }, [featuredBooks, featuredCarouselIndex]);

  const goToPreviousFeatured = () => {
    setFeaturedCarouselIndex(prev => prev === 0 ? totalFeaturedPages - 1 : prev - 1);
  };

  const goToNextFeatured = () => {
    setFeaturedCarouselIndex(prev => prev === totalFeaturedPages - 1 ? 0 : prev + 1);
  };

  const goToFeaturedPage = (pageIndex: number) => {
    setFeaturedCarouselIndex(pageIndex);
  };

  const genres = useMemo(() => {
    const allGenres = books.flatMap(book => book.genre);
    return ['All', ...new Set(allGenres)];
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || book.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title': comparison = a.title.localeCompare(b.title); break;
        case 'author': comparison = a.author.localeCompare(b.author); break;
        case 'datePublished': comparison = new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime(); break;
        case 'rating': comparison = a.rating - b.rating; break;
        case 'reviewCount': comparison = a.reviewCount - b.reviewCount; break;
        case 'price': comparison = a.price - b.price; break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [books, searchQuery, selectedGenre, sortBy, sortOrder]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, sortBy, sortOrder, itemsPerPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Featured Books Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Books</h2>
          {totalFeaturedPages > 1 && (
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {Array.from({ length: totalFeaturedPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeaturedPage(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${index === featuredCarouselIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to featured books page ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={goToPreviousFeatured} className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer" aria-label="Previous featured books">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={goToNextFeatured} className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer" aria-label="Next featured books">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentFeaturedBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={onAddToCart}
                index={index} // <-- تمرير index لتطبيق animation
                isFeatured={true}
              />
            ))}
          </div>
          {totalFeaturedPages > 1 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Showing {featuredCarouselIndex * booksPerPage + 1} - {Math.min((featuredCarouselIndex + 1) * booksPerPage, featuredBooks.length)} of {featuredBooks.length} featured books
            </div>
          )}
        </div>
      </section>

      {/* All Books List */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Books</h2>
        {filteredAndSortedBooks.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedBooks.map((book, index) => (
                <BookListItem
                  key={book.id}
                  book={book}
                  onAddToCart={onAddToCart}
                  index={index} // <-- هذا يحل مشكلة staggered animation
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedBooks.length}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">No books found matching your criteria.</p>
        )}
      </section>
    </div>
  );
};

export default BookGrid;
