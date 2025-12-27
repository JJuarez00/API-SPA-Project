/**
 * Author: Ashley Rodriguez Vega
 * Date: 12/10/2025
 * File: pagination.jsx
 * Description: this script implements pagination and sorting of categories
 */

import {settings} from "../../config/config";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const Pagination = ({categories, setUrl}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    // DEFAULT SORT = FIRST OPTION
    const [sort, setSort] = useState("[category_id:asc, category_name:asc]");

    // first, last, previous, next, self
    const [pages, setPages] = useState({});

    useEffect(() => {
        if (!categories) return;

        const {limit: catLimit, offset: catOffset, totalCount, links} = categories;

        setLimit(catLimit);
        setOffset(catOffset);

        // use values from categories directly
        setTotalPages(Math.ceil(totalCount / catLimit));
        setCurrentPage(catOffset / catLimit + 1);

        const newPages = {};
        if (Array.isArray(links)) {
            links.forEach((link) => {
                newPages[link.rel] = link.href;
            });
        }

        if (!newPages.prev) {
            newPages.prev = newPages.self;
        }

        if (!newPages.next) {
            newPages.next = newPages.self;
        }

        setPages(newPages);
    }, [categories]);

    const handlePageClick = (e) => {
        e.preventDefault();
        const href = e.currentTarget.dataset.href;
        if (!href) return;

        // If your API links already include sort, just use href.
        // If they don't, append sort in the same format as Postman.
        const url = href.includes("sort=")
            ? href
            : `${href}&sort=${encodeURIComponent(sort)}`;

        setUrl(url);
    };

    const setItemsPerPage = (e) => {
        const newLimit = Number(e.target.value);
        setLimit(newLimit);
        setOffset(0);

        setUrl(
            `${settings.baseApiUrl}/categories?limit=${newLimit}&offset=0&sort=${encodeURIComponent(
                sort
            )}`
        );
    };

    const sortCategories = (e) => {
        const newSort = e.target.value;
        setSort(newSort);

        setUrl(
            `${settings.baseApiUrl}/categories?limit=${limit}&offset=${offset}&sort=${encodeURIComponent(
                newSort
            )}`
        );
    };

    return (
        <>
            {categories && (
                <div className="category-pagination-container">
                    <div className="category-pagination">
                        Showing page {currentPage} of {totalPages}&nbsp;
                        <Link
                            to="#"
                            title="First page"
                            data-href={pages.first}
                            onClick={handlePageClick}
                        >
                            &lt;&lt;
                        </Link>
                        <Link
                            to="#"
                            title="Previous page"
                            data-href={pages.prev}
                            onClick={handlePageClick}
                        >
                            &lt;
                        </Link>
                        <Link
                            to="#"
                            title="Next page"
                            data-href={pages.next}
                            onClick={handlePageClick}
                        >
                            &gt;
                        </Link>
                        <Link
                            to="#"
                            title="Last page"
                            data-href={pages.last}
                            onClick={handlePageClick}
                        >
                            &gt;&gt;
                        </Link>
                        &nbsp; Items per page &nbsp;
                        <select onChange={setItemsPerPage} value={limit}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="category-sorting">
                        Sort by:&nbsp;
                        <select onChange={sortCategories} value={sort}>
                            <option value="[category_id:asc, category_name:asc]">
                                ID min to high
                            </option>
                            <option value="[category_id:desc, category_name:asc]">
                                ID high to low
                            </option>
                            <option value="[category_name:asc]">
                                Name A–Z
                            </option>
                            <option value="[category_name:desc]">
                                Name Z–A
                            </option>
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pagination;