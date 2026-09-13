import React from "react";

export function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPage = Math.ceil(data.length / itemsPerPage); //10 : 3 =3.333 -> 4

  const startIndex = (currentPage - 1) * itemsPerPage; //tinh vi tri bat dau lay du lieu trong mang

  const currentItems = data.slice(startIndex, startIndex + itemsPerPage); //lay data tu vi tri startIndex den truoc startIndex + itemsPerpage

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage));
  };
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (p: number) => {
    setCurrentPage(Math.max(Math.min(p, totalPage), 1)); //chan dau cuoi khong cho p vuot qua totalpage va nho hon 1
  };
  return {
    currentPage,
    totalPage,
    nextPage,
    prevPage,
    goToPage,
    currentItems,
  };
}
