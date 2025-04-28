import { Pagination } from "react-bootstrap";

const CustomPagination = ({currentPage, totalPage, searchParams, setSearchParams}) => {
    const handleChangePage = (page) => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set("page", page.toString());
        setSearchParams(updatedParams);
    };

    return (
        <Pagination className="w-100 d-flex justify-content-center">
            <Pagination.First
                onClick={() => handleChangePage(1)}
                disabled={currentPage === 1}
            />
            <Pagination.Prev
                onClick={() => currentPage > 1 && handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
            />
            {Array.from({ length: totalPage }, (_, index) => (
                <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => handleChangePage(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => currentPage < totalPage && handleChangePage(currentPage + 1)}
                disabled={currentPage === totalPage}
            />
            <Pagination.Last
                onClick={() => handleChangePage(totalPage)}
                disabled={currentPage === totalPage}
            />
        </Pagination>
    );
};

export default CustomPagination;
