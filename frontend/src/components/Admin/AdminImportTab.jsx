import { Button, Col, Form, FormSelect, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import ModalAddImport from "./modal/ModalAddImport.jsx";
import ModalImportDetail from "./modal/ModalDetailImport.jsx"; // New import
import { API_URL } from "../../utils/Constant.jsx";
import { useNotificationContext } from "../../hooks/useNotificationContext.jsx";
import CustomPagination from "../CustomPagination.jsx";
import { useSearchParams } from "react-router-dom";

const statusMap = new Map([
    ["pending", "Đang xử lý"],
    ["confirmed", "Đã xác nhận"],
    ["cancelled", "Đã hủy"],
    ["on_deliver", "Đang giao hàng"],
    ["delivered", "Đã giao hàng"],
]);

const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "warning";
        case "confirmed":
            return "info";
        case "cancelled":
            return "danger";
        case "on_deliver":
            return "primary";
        case "delivered":
            return "success";
        default:
            return "secondary";
    }
};

export const AdminImportTab = ({ hasPermission }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); // New state
    const [selectedImportId, setSelectedImportId] = useState(null); // New state
    const [imports, setImports] = useState([]);
    const [searchBy, setSearchBy] = useState("");
    const [search, setSearch] = useState("");
    const { showNotification } = useNotificationContext();
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchImports = async () => {
            try {
                const url = `${API_URL}import?limit=10&${searchParams.toString()}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: signal,
                });
                const data = await response.json();
                if (data.status === 200) {
                    setImports(data.imports.data);
                    setTotalPage(parseInt(data.imports.totalPage));
                    setCurrentPage(parseInt(data.imports.page));
                } else {
                    showNotification("Lỗi khi tải dữ liệu nhập hàng");
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching imports:", error);
                    showNotification("Lỗi khi tải dữ liệu nhập hàng");
                }
            }
        };
        fetchImports();
        return () => {
            controller.abort();
        };
    }, [searchParams, setSearchParams, reloadTrigger]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchProviders = async () => {
            try {
                const response = await fetch(`${API_URL}provider?provider_status=all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: signal,
                });
                const data = await response.json();
                setProviders(data.providers);
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };
        fetchProviders();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (fromDate === "" && toDate === "" && searchBy === "" && search === "") {
            return;
        }

        if (
            (fromDate !== "" || toDate !== "") &&
            new Date(toDate) < new Date(fromDate)
        ) {
            showNotification("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
            return;
        }

        if (fromDate !== "") {
            searchParams.set("from", fromDate);
        }

        if (toDate !== "") {
            searchParams.set("to", toDate);
        }

        if (searchBy !== "") {
            searchParams.set("searchBy", searchBy);
        }

        if (search !== "") {
            searchParams.set("search", search);
        }

        searchParams.delete("page");
        setSearchParams(searchParams);
    }, [fromDate, toDate, searchBy, search]);

    const resetAllState = () => {
        setSearchBy("");
        setSearch("");
        setFromDate("");
        setToDate("");
        searchParams.delete("page");
        searchParams.delete("from");
        searchParams.delete("to");
        searchParams.delete("searchBy");
        searchParams.delete("search");
        setSearchParams(searchParams);
    };

    const handleSaveImport = async (importData) => {
        try {
            const response = await fetch(
                `${API_URL}import/provider/${importData.providerId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(importData),
                }
            );

            const data = await response.json();
            showNotification(data.message);
            resetAllState();
            setReloadTrigger(!reloadTrigger);
        } catch (error) {
            console.error("Error saving import data:", error);
            showNotification("Lỗi khi lưu dữ liệu nhập hàng");
        }
    };

    const handleStatusChange = async (importId, oldStatus, newStatus) => {
        try {
            const response = await fetch(`${API_URL}import/${importId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldStatus: oldStatus,
                    newStatus: newStatus,
                }),
            });

            const data = await response.json();
            if (data.status === 200) {
                showNotification("Cập nhật trạng thái thành công");
                setReloadTrigger(!reloadTrigger);
            } else {
                showNotification(data.message || "Lỗi khi cập nhật trạng thái");
            }
        } catch (error) {
            console.error("Error updating import status:", error);
            showNotification("Lỗi khi cập nhật trạng thái");
        }
    };

    const handleShowDetailModal = (importId) => {
        setSelectedImportId(importId);
        setShowDetailModal(true);
    };

    return (
        <>
            <Row className={"h-15 mb-5 mt-4 align-content-center"}>
                <Form className="d-flex flex-wrap gap-2">
                    <Row className={"text-center"}>
                        <Col className="d-flex justify-content-center align-items-center gap-3">
                            <FormSelect
                                style={{ maxWidth: "150px" }}
                                value={searchBy}
                                onChange={(e) => {
                                    setSearchBy(e.target.value);
                                    setSearch("");
                                }}
                            >
                                <option value="">Tìm theo</option>
                                <option value="status">Trạng thái</option>
                                <option value="provider_id">Nhà cung cấp</option>
                            </FormSelect>
                            {searchBy === "status" && (
                                <Form.Select
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    value={search}
                                    defaultValue={"pending"}
                                >
                                    <option value="pending">Đang xử lý</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="on_deliver">Đang giao hàng</option>
                                    <option value="delivered">Đã giao hàng</option>
                                </Form.Select>
                            )}
                            {searchBy === "provider_id" && (
                                <Form.Select
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                >
                                    <option value="">--Chọn--</option>
                                    {providers.map((provider) => (
                                        <option
                                            key={provider.provider_id}
                                            value={provider.provider_id}
                                        >
                                            {provider.provider_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            )}
                            <Form.Control
                                type="date"
                                className={"m-auto"}
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                }}
                            />
                            <Form.Control
                                type="date"
                                className={"m-auto"}
                                value={toDate}
                                min={fromDate || undefined}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                }}
                            />
                            <Button
                                className={'custom-button'}
                                onClick={() => {
                                    resetAllState();
                                }}
                                style={{ height: "36px" }}
                            >
                                <i className="fa-solid fa-rotate-right"></i>
                            </Button>
                        </Col>
                    </Row>
                    {hasPermission("Thêm") && (
                        <Form.Group className="d-flex gap-2">
                            <Button
                                className={'custom-button'}
                                variant="success"
                                style={{ height: "37px" }}
                                onClick={() => {
                                    setShowAddModal(true);
                                }}
                            >
                                + Tạo nhập hàng
                            </Button>
                        </Form.Group>
                    )}
                </Form>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nhà cung cấp</th>
                        <th>Ngày nhập</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Nhân viên</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {imports.map((importItem) => (
                        <tr key={importItem.import_id}>
                            <td>{importItem.import_id}</td>
                            <td>{importItem.provider_name}</td>
                            <td>{new Date(importItem.date).toLocaleString()}</td>
                            <td>{parseInt(importItem.total).toLocaleString('vi-VN')} VND</td>
                            <td>
                                <FormSelect
                                    disabled={
                                        importItem.status === "delivered" ||
                                        importItem.status === "cancelled"
                                    }
                                    value={importItem.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            importItem.import_id,
                                            importItem.status,
                                            e.target.value
                                        )
                                    }
                                    className={`p-0 btn btn-${getStatusColor(importItem.status)}`}
                                >
                                    {Array.from(statusMap.entries()).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </FormSelect>
                            </td>
                            <td>{importItem.full_name}</td>
                            <td>{importItem.phone}</td>
                            <td>{importItem.address}</td>
                            <td className={"text-center"}>
                                {hasPermission("Xem") && (
                                    <Button
                                        variant="info"
                                        onClick={() => handleShowDetailModal(importItem.import_id)}
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {totalPage > 1 && (
                    <CustomPagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                    />
                )}
            </Row>
            {showAddModal && (
                <ModalAddImport
                    show={showAddModal}
                    handleClose={() => setShowAddModal(false)}
                    onSave={handleSaveImport}
                />
            )}
            {showDetailModal && (
                <ModalImportDetail
                    show={showDetailModal}
                    handleClose={() => setShowDetailModal(false)}
                    importId={selectedImportId}
                />
            )}
        </>
    );
};