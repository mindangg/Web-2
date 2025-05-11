import { Container, Tab, Tabs} from "react-bootstrap";
import {useAdminContext} from "../hooks/useAdminContext.jsx";
import AdminProviderTab from "../components/Admin/AdminProviderTab.jsx";
import {AdminImportTab} from "../components/Admin/AdminImportTab.jsx";

const AdminImport = () => {
    const {admin} = useAdminContext();

    const hasAccess = (functionName, action) => {
        const functions = admin?.employee?.[0]?.role?.functions || []
        const matchedFunc = functions.find(f => f.function_name === functionName)
        return matchedFunc?.actions?.includes(action)
    }

    const hasPermission = (action) => {
        return hasAccess("Kho hàng", action)
    }

    return (
        <Container fluid className={"w-100 rounded-3 pt-4"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Tabs
                defaultActiveKey="ncc"
                id="uncontrolled-tab-example"
                className="w-100 text-center"
                style={{backgroundColor: 'lightgray', borderRadius: '5px', borderBottom: '1px solid black'}}
                justify
            >
                <Tab title={"Nhà cung cấp"} eventKey={"ncc"}>
                    <AdminProviderTab
                        hasPermission={hasPermission}
                    />
                </Tab>
                <Tab title={"Nhập hàng"} eventKey={"nhap"}>
                    <AdminImportTab
                        hasPermission={hasPermission}
                    />
                </Tab>
            </Tabs>
        </Container>
    )
}

export default AdminImport;