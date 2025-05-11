import {Badge, Button, Form, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import ModalAddProvider from "./modal/ModalAddProvider.jsx";
import {API_URL} from "../../utils/Constant.jsx";
import {useNotificationContext} from "../../hooks/useNotificationContext.jsx";
import ModalUpdateProvider from "./modal/ModalUpdateProvider.jsx";
import ModalConfirmDelete from "./modal/ModalConfirmDelete.jsx";

const AdminProviderTab = ({hasPermission}) => {
    const [searchBy, setSearchBy] = useState('provider_name');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const {showNotification} = useNotificationContext();

    const [nccList, setNccList] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        let url = `${API_URL}provider?provider_status=all`;
        if (searchBy && search) {
            url += `&searchBy=${searchBy}&search=${search}`;
        }
        const fetchNccList = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: signal,
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Không thể tải danh sách NCC');
                }
                setNccList(data.providers || []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Lỗi khi tải danh sách NCC:', err);
                } else {
                    console.log('Fetch aborted:', err);
                }
            }
        };
        fetchNccList();

        return () => {
            controller.abort();
        }

    }, [reloadTrigger, search, searchBy]);

    const handleSave = async (providerData) => {
        try {
            const response = await fetch(`${API_URL}provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(providerData),
            });
            const data = await response.json();
            if (!response.ok) {
                showNotification(data.message)
                throw new Error(data.error || 'Không thể thêm NCC');
            }
            showNotification(data.message);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Lỗi khi thêm NCC:', err);
            } else {
                console.log('Fetch aborted:', err);
            }
        } finally {
            setReloadTrigger(!reloadTrigger);
        }
    };

    const handleUpdate = async (updatedProviderData) => {
        try {
            const response = await fetch(`${API_URL}provider/${updatedProviderData.provider_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProviderData),
            });
            const data = await response.json();
            if (!response.ok) {
                showNotification(data.message)
                throw new Error(data.error || 'Không thể cập nhật NCC');
            }
            showNotification(data.message);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Lỗi khi cập nhật NCC:', err);
            } else {
                console.log('Fetch aborted:', err);
            }
        } finally {
            setReloadTrigger(!reloadTrigger);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}provider/${selectedProvider.provider_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                showNotification(data.message)
                throw new Error(data.error || 'Không thể xóa NCC');
            }
            showNotification(data.message);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Lỗi khi xóa NCC:', err);
            } else {
                console.log('Fetch aborted:', err);
            }
        } finally {
            setReloadTrigger(!reloadTrigger);
            setShowDeleteModal(false);
            setSelectedProvider(null);
        }
    };

    return (
        <>
            <Row className={"h-15 mb-5 mt-4 align-content-center"}>
                <Form className="d-flex flex-wrap gap-2">
                    <Form.Group controlId="selectsearchBy">
                        <Form.Select
                            onChange={(e) => {
                                setSearch('');
                                setSearchBy(e.target.value);
                            }}
                            defaultValue={searchBy}
                        >
                            <option value="provider_name">Tên nhà cung cấp</option>
                            <option value="provider_id">ID nhà cung cấp</option>
                            <option value="phone">SĐT</option>
                            <option value="address">Địa chỉ</option>
                            <option value="email">Email</option>
                            <option value="provider_status">Trạng thái</option>
                        </Form.Select>
                    </Form.Group>
                    {(searchBy !== 'provider_status') && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Control
                                type="text"
                                placeholder="Nhập từ khóa..."
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                        </Form.Group>
                    )}
                    {searchBy === "provider_status" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => setSearch(e.target.value)}
                                defaultValue={search}
                            >
                                <option value={"all"}>--Chọn--</option>
                                <option value={"true"}>Đang hoạt động</option>
                                <option value={"false"}>Ngừng hoạt động</option>
                            </Form.Select>
                        </Form.Group>
                    )}
                    {hasPermission("Thêm") && (
                        <Form.Group controlId="sortButtons" className="d-flex gap-2">
                            <Button
                                variant="success"
                                style={{height: '37px'}}
                                onClick={() => setShowAddModal(true)}
                            >
                                + Thêm NCC
                            </Button>
                        </Form.Group>
                    )}
                </Form>
            </Row>
            <Row>
                <Table striped bordered hover className={"text-center mb-4"}
                       style={{verticalAlign: 'middle'}}
                >
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên NCC</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th colSpan={2}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nccList.map((ncc, index) => (
                        <tr key={index}>
                            <td>{ncc.provider_id}</td>
                            <td>{ncc.provider_name}</td>
                            <td>{ncc.phone}</td>
                            <td>{ncc.address}</td>
                            <td>{ncc.email}</td>
                            <td className={'text-center'}>
                                <Badge bg={ncc.provider_status ? "success" : "danger"}>
                                    {ncc.provider_status ? "Hoạt động" : "Ngừng hoạt động"}
                                </Badge>
                            </td>
                            <td className={'text-center'}>
                                {hasPermission("Sửa") && (
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setSelectedProvider(ncc);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        <i className='fa-solid fa-pen-to-square'></i>
                                    </Button>
                                )}
                            </td>
                            <td className={'text-center'}>
                                {hasPermission("Xóa") && (
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            setSelectedProvider(ncc);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <i className='fa-solid fa-trash-can'></i>
                                    </Button>)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
            <ModalAddProvider
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onSave={handleSave}
            />
            {selectedProvider && (<ModalUpdateProvider
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                providerData={selectedProvider}
                onUpdate={handleUpdate}
            />)}
            {selectedProvider && (<ModalConfirmDelete
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa nhà cung cấp"
                body={`Bạn có chắc chắn muốn xóa nhà cung cấp ${selectedProvider.provider_name} không?`}
                handleDelete={handleDelete}
            />)}
        </>
    );
}

export default AdminProviderTab;