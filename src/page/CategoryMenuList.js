import React from "react";
import { useParams } from "react-router-dom";

// 부트스트랩 import
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "../css/MenuInsert.css";

import { useAccessToken } from "../store/useStore";
import { getData, postData, postWithFileData } from "../api/Users";

export default function CategoryMenuList() {
  const accessToken = useAccessToken().accessToken;

  // storeId 설정
  const { id: storeId } = useParams();

  // 카테고리 설정
  const [categoryList, setCategoryList] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = React.useState(null);
  const [categoryModalShow, setCategoryModalShow] = React.useState(false);

  // 메뉴 설정
  const [menuList, setMenuList] = React.useState([]);
  const [menuModalShow, setMenuModalShow] = React.useState(false);

  // 카테고리 조회
  const fetchCategoryList = React.useCallback(async () => {
    try {
      const fetchedCategoryList = await getData(
        `/${storeId}/category`,
        accessToken
      );
      console.log("카테고리 리스트 : ", fetchedCategoryList.data); // data에 접근
      setCategoryList(fetchedCategoryList.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  }, [accessToken, storeId]);

  React.useEffect(() => {
    fetchCategoryList();
  }, [accessToken, storeId, fetchCategoryList]);

  // 메뉴 불러오기
  const fetchMenuList = async (categoryId) => {
    try {
      const fetchedMenuList = await getData(
        `/${storeId}/category/${categoryId}/menu`,
        accessToken
      );
      console.log("메뉴 리스트 : ", fetchedMenuList.data); // data에 접근
      setMenuList(fetchedMenuList.data);
    } catch (error) {
      console.error("Error fetching menu list:", error);
    }
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.categoryId);
    setSelectedCategoryName(category.name);
    fetchMenuList(category.categoryId);
  };

  // 카테고리 모달
  const PostCategory = (props) => {
    const [categoryName, setCategoryName] = React.useState("");

    const handleAddCategory = async () => {
      if (!categoryName.trim()) {
        alert("카테고리 이름을 입력하세요");
        return; // 카테고리 추가 중단
      }

      const url = `/${storeId}/category`;
      const token = accessToken;
      const data = { name: categoryName };

      try {
        const postResponse = await postData(url, token, data);
        if (postResponse.httpStatusCode === 201) {
          alert("카테고리가 성공적으로 추가되었습니다.");
          fetchCategoryList();
        }
      } catch (error) {
        alert("카테고리 추가에 실패하였습니다.");
        console.error("Error posting category:", error);
      }

      setCategoryName("");
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
          <b>카테고리 추가</b>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>카테고리 이름</Form.Label>
              <Form.Control
                placeholder="카테고리 이름을 입력하세요"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onHide}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // 메뉴 모달
  const PostMenu = (props) => {
    // 메뉴 폼 상태관리
    const [menuImage, setFile] = React.useState(null);

    const [menuData, setMenuData] = React.useState({
      menuName: "",
      price: "",
      caption: "",
      category: "쓰레기 지워라",
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
      const { name, value } = e.target;
      setMenuData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // 파일 변경 핸들러
    const handleFileChange = (e) => {
      setFile(e.target.files[0]); // 첫 번째 파일만 선택
    };

    // 입력란 확인
    const validateMenuData = () => {
      const { menuName, price, caption, category } = menuData;

      if (!menuName.trim()) {
        alert("메뉴 이름을 입력하세요.");
        return false;
      }

      if (!price.trim() || isNaN(price) || Number(price) <= 0) {
        alert("올바른 가격을 입력하세요.");
        return false;
      }

      if (!caption.trim()) {
        alert("설명을 입력하세요.");
        return false;
      }

      if (!category.trim()) {
        alert("카테고리를 선택하세요.");
        return false;
      }

      if (!menuImage) {
        alert("파일을 업로드하세요.");
        return false;
      }

      return true;
    };

    // 메뉴 추가 api 호출
    const handleAddMenu = async () => {
      if (!validateMenuData()) {
        return; // 입력값이 유효하지 않으면 메뉴 추가 중단
      }

      const formData = new FormData();

      // FormData에 data 추가
      if (menuImage) {
        formData.append("menuImage", menuImage);
      }

      for (const key in menuData) {
        formData.append(key, menuData[key]);
      }

      // FormData 내용 확인
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const url = `/${storeId}/category/${selectedCategory}/menu`;
      const token = accessToken;

      try {
        const postResponse = await postWithFileData(url, token, formData);
        if (postResponse.httpStatusCode === 201) {
          alert("메뉴가 성공적으로 추가되었습니다.");
          fetchMenuList(selectedCategory);
        }
      } catch (error) {
        alert("메뉴 추가에 실패하였습니다.");
        console.error("Error posting menu:", error);
      }
      // 초기화 및 모달 닫기
      setMenuData({
        menuName: "",
        price: "",
        caption: "",
        category: "",
      });
      setFile(null);
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
          <b>메뉴 추가</b>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-1">
              <Col xs={3}>
                <Form.Label>카테고리 이름</Form.Label>
                <Form.Select disabled>
                  <option value="">{selectedCategoryName}</option>
                </Form.Select>
              </Col>
              <Col xs={5}>
                <Form.Group className="mb-3" controlId="formGroupName">
                  <Form.Label>메뉴 이름</Form.Label>
                  <Form.Control
                    name="menuName"
                    placeholder="메뉴 이름을 입력하세요"
                    value={menuData.menuName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupPrice">
                  <Form.Label>가격</Form.Label>
                  <Form.Control
                    name="price"
                    placeholder="가격을 입력하세요"
                    value={menuData.price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formGroupCaption">
                <Form.Label>설명</Form.Label>
                <Form.Control
                  name="caption"
                  placeholder="설명을 입력하세요"
                  value={menuData.caption}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formGroupFile">
                <Form.Label>파일 업로드</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onHide}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleAddMenu}>
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // 메뉴 모달 오픈
  function modalOpenHandler() {
    if (selectedCategory === null) {
      alert("카테고리를 먼저 선택해주세요");
    } else {
      setMenuModalShow(true);
    }
  }

  return (
    <div>
      {/* 카테고리 */}
      <Container style={{ marginBottom: "30px" }}>
        <Row xs="auto">
          <Col>
            <p>
              <b>카테고리</b>
            </p>
          </Col>
          <Col>
            <p onClick={() => setCategoryModalShow(true)}> 추가</p>
          </Col>
        </Row>
        <Row className="category-list">
          {categoryList.length === 0 ? (
            <Row>
              <Col>카테고리를 추가하세요</Col>
            </Row>
          ) : (
            categoryList.map((category) => (
              <Row key={category.categoryId} style={{ width: "auto" }}>
                <Button
                  size="md"
                  style={{
                    width: "13rem",
                    height: "3rem",
                    backgroundColor:
                      selectedCategory === category.categoryId
                        ? "#2D9CDB"
                        : "#ffffff",
                    color:
                      selectedCategory === category.categoryId
                        ? "#ffffff"
                        : "#1B1B1B",
                    borderColor:
                      selectedCategory === category.categoryId
                        ? "#2D9CDB"
                        : "#E0E0E0",
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category.name}
                </Button>
              </Row>
            ))
          )}
        </Row>
      </Container>
      {/* 메뉴 */}
      <Container>
        <Row xs="auto">
          <Col>
            <p>
              <b>메뉴</b>
            </p>
          </Col>
          <Col>
            <p onClick={modalOpenHandler}> 추가</p>
          </Col>
        </Row>
        <Row xs="auto">
          {selectedCategory === null ? (
            <Col>카테고리를 선택해주세요</Col>
          ) : menuList.length > 0 ? (
            menuList.map((menu) => (
              <Col key={menu.menuId} style={{ marginBottom: "10px" }}>
                <Card style={{ width: "15rem" }}>
                  <Card.Img
                    variant="top"
                    src={menu.menuImage}
                    alt={menu.menuName}
                    style={{ width: "15rem", height: "13rem" }}
                  />
                  <Card.Body>
                    <Card.Title>{menu.menuName}</Card.Title>
                    <Card.Text>가격: {menu.price} 원</Card.Text>
                    <Card.Text>{menu.caption}</Card.Text>
                    <Button variant="primary" style={{ marginLeft: "9.3rem" }}>
                      편집
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col> 메뉴를 추가해주세요 </Col>
          )}
        </Row>
      </Container>
      <PostCategory
        show={categoryModalShow}
        onHide={() => setCategoryModalShow(false)}
      />
      <PostMenu show={menuModalShow} onHide={() => setMenuModalShow(false)} />
    </div>
  );
}
