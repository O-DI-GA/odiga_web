import React from "react";
import { useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useAccessToken } from "../store/useStore";
import { getData, postData } from "../api/Users";

import "../css/TableSetting.css";

const PlusButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#F6FAFD",
  width: "100%",
}));

const CancleButton = styled(Button)(({ theme }) => ({
  color: "#8C8C8C",
}));

export default function TableSetting() {
  const accessToken = useAccessToken().accessToken;

  // storeId 설정
  const { id: storeId } = useParams();
  // 변수 설정
  const [tableData, setTableData] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  // 테이블 정보 불러오기
  const fetchTableData = async () => {
    try {
      const fecthTableApi = await getData(
        `/store/${storeId}/tables`,
        accessToken
      );
      console.log("테이블 데이터 리스트 : ", fecthTableApi.data);
      setTableData(fecthTableApi.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  React.useEffect(() => {
    fetchTableData();
  }, [accessToken, storeId]);

  // 모달 오픈
  function modalOpenHandler() {
    setModalShow(true);
  }

  // 테이블 생성 모달
  const TableAddModal = (props) => {
    const [addTable, setAddTable] = React.useState({
      tableNumber: "",
      maxSeatCount: "",
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddTable((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // 입력란 확인
    const validateTableData = () => {
      const { tableNumber, maxSeatCount } = addTable;

      if (!tableNumber.trim()) {
        alert("테이블 번호를 입력하세요.");
        return false;
      }

      if (!maxSeatCount.trim()) {
        alert("착석 가능한 인원 수를 입력하세요.");
        return false;
      }
    };

    // 메뉴 추가 api 호출
    const handleAddTable = async () => {
      if (!validateTableData()) {
        return; // 입력값이 유효하지 않으면 메뉴 추가 중단
      }

      const url = `store/${storeId}/tables`;
      const token = accessToken;

      try {
        const postResponse = await postData(url, token, addTable);
        if (postResponse.httpStatusCode === 201) {
          alert("테이블이 성공적으로 추가되었습니다.");
          fetchTableData();
        } else if (postResponse.httpStatusCode === 400) {
          alert(postResponse.errorMessage);
        }
      } catch (error) {
        alert("테이블 추가에 실패하였습니다.");
        console.error("Error posting menu:", error);
      }
      // 초기화 및 모달 닫기
      setAddTable({
        tableNumber: "",
        maxSeatCount: "",
      });
      props.onHide(); // 모달 닫기
    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        style={{ zIndex: "10500" }}
      >
        <Modal.Header closeButton>
          <b>테이블 추가</b>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-1">
              <Col xs={5}>
                <Form.Group className="mb-3" controlId="formGroupName">
                  <Form.Label>테이블 번호</Form.Label>
                  <Form.Control
                    name="tableNumber"
                    placeholder="테이블 번호를 입력하세요"
                    value={addTable.tableNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupPrice">
                  <Form.Label>착석 가능한 인원 수</Form.Label>
                  <Form.Control
                    name="maxSeatCount"
                    placeholder="인원 수를 입력하세요"
                    value={addTable.maxSeatCount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <CancleButton onClick={props.onHide}>닫기</CancleButton>
          <Button variant="outlined" onClick={handleAddTable}>
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <h5>테이블 정보 설정</h5>
      <table className="table-container">
        <thead>
          <tr className="table-header">
            <th>테이블 번호</th>
            <th>착석 가능 인원</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((table) => (
            <tr className="table-columns" key={table.storeTableId}>
              <td>{table.tableNumber}</td>
              <td>{table.maxSeatCount}명</td>
              <td className="table-btn">
                <Button variant="outlined"> 편집 </Button>
                <Button variant="outlined" color="error">
                  삭제
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3">
              <PlusButton variant="outlined" onClick={modalOpenHandler}>
                {" "}
                테이블 추가{" "}
              </PlusButton>
            </td>
          </tr>
        </tbody>
      </table>
      <TableAddModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
}
