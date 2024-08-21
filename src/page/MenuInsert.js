import React from 'react';
// 부트스트랩 import
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// 메뉴 mock 데이터
const MenuMockData = [
    {
        category: '카테고리1',
        menus: [
            { name: '떡볶이', price: '12,600원', img: require('../assets/menuImage/떡볶이.jpg') },
            { name: '모둠 튀김', price: '5,000원', img: require('../assets/menuImage/모둠튀김.jpg') },
        ],
    },
    {
        category: '카테고리2',
        menus: [
            { name: '에비동', price: '12,600원', img: require('../assets/menuImage/에비동.jpg') },
            { name: '가츠동', price: '15,000원', img: require('../assets/menuImage/가츠동.jpg') },
            { name: '오야코동', price: '12,000원', img: require('../assets/menuImage/오야꼬동.jpg') },
        ],
    },
];

// 카테고리 mock 데이터
const CategoryMockData = [
    { name: '카테고리1', menuList: MenuMockData[0] },
    { name: '카테고리2', menuList: MenuMockData[1] },
    { name: '카테고리3', menuList: [] },
    { name: '카테고리4', menuList: [] },
    { name: '카테고리5', menuList: [] },
    { name: '카테고리6', menuList: [] },
    { name: '카테고리7', menuList: [] },
    { name: '카테고리8', menuList: [] },
    { name: '카테고리9', menuList: [] },
    { name: '카테고리10', menuList: [] },
    { name: '카테고리11', menuList: [] },
];

function MenuInsert() {
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [selectedMenus, setSelectedMenus] = React.useState([]);

    // 카테고리 한 줄에 표시할 수 있는 개수
    const categoryPerRow = CategoryMockData.length;

    // 카테고리 모달
    const [categoryModalShow, setCategoryModalShow] = React.useState(false);
    // 메뉴 모달
    const [menuModalShow, setMenuModalShow] = React.useState(false);

    React.useEffect(() => {
        // 선택된 카테고리에 맞는 메뉴를 설정
        const category = CategoryMockData.find((c) => c.name === selectedCategory);
        if (category) {
            setSelectedMenus(category.menuList.menus || []);
        } else {
            setSelectedMenus([]);
        }
    }, [selectedCategory]);

    return (
        <div style={{ marginTop: '40px' }}>
            {/* 카테고리 */}
            <Container style={{ marginBottom: '30px' }}>
                <Row xs="auto">
                    <Col>
                        <p>
                            <b>카테고리</b>
                        </p>
                    </Col>
                    <Col>
                        <p onClick={() => setCategoryModalShow(true)}>추가</p>
                    </Col>
                </Row>
                {CategoryMockData.length === 0 ? (
                    <Row>
                        <Col>카테고리를 추가하세요</Col>
                    </Row>
                ) : (
                    Array(Math.ceil(CategoryMockData.length / categoryPerRow))
                        .fill()
                        .map((_, rowIndex) => (
                            <Row xs="auto" key={rowIndex} style={{ gap: '10px' }}>
                                {CategoryMockData.slice(
                                    rowIndex * categoryPerRow,
                                    rowIndex * categoryPerRow + categoryPerRow
                                ).map((category, index) => (
                                    <Col key={index}>
                                        <Button
                                            size="md"
                                            style={{
                                                width: '13rem',
                                                height: '3rem',
                                                backgroundColor:
                                                    selectedCategory === category.name ? '#2D9CDB' : '#ffffff',
                                                color: selectedCategory === category.name ? '#ffffff' : '#1B1B1B',
                                                borderColor: selectedCategory === category.name ? '#2D9CDB' : '#E0E0E0',
                                            }}
                                            onClick={() => setSelectedCategory(category.name)}
                                        >
                                            {category.name}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        ))
                )}
            </Container>
            <Container>
                {/* 메뉴 */}
                <Row xs="auto">
                    <Col>
                        <p>
                            <b>메뉴</b>
                        </p>
                    </Col>
                    <Col>
                        <p onClick={() => setMenuModalShow(true)}>추가</p>
                    </Col>
                </Row>
                <Row xs="auto">
                    {selectedCategory === null ? (
                        <Col>카테고리를 선택해주세요</Col>
                    ) : selectedMenus.length > 0 ? (
                        selectedMenus.map((menu, index) => (
                            <Col key={index}>
                                <Card style={{ width: '15rem' }}>
                                    <Card.Img
                                        variant="top"
                                        src={menu.img}
                                        alt={menu.name}
                                        style={{ width: '15rem', height: '13rem' }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{menu.name}</Card.Title>
                                        <Card.Text>{menu.price}</Card.Text>
                                        <Button variant="primary" style={{ marginLeft: '9.3rem' }}>
                                            편집
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>선택된 카테고리에 메뉴가 없습니다.</Col>
                    )}
                </Row>
            </Container>
            <InsertCategoryModal show={categoryModalShow} onHide={() => setCategoryModalShow(false)} />
            <InsertMenuModal show={menuModalShow} onHide={() => setMenuModalShow(false)} />
        </div>
    );
}

// 카테고리 모달
function InsertCategoryModal(props) {
    // 폼의 상태 관리
    const [categoryName, setCategoryName] = React.useState('');

    // 추가 버튼 클릭 시 콘솔 출력
    const handleAddCategory = () => {
        console.log('카테고리 이름:', categoryName);
        props.onHide(); // 모달 닫기
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
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
}

// 메뉴 모달
function InsertMenuModal(props) {
    // 폼의 상태 관리
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [menuName, setMenuName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [file, setFile] = React.useState(null);

    // 추가 버튼 클릭 시 콘솔 출력
    const handleAddMenu = () => {
        console.log('카테고리:', selectedCategory);
        console.log('메뉴 이름:', menuName);
        console.log('가격:', price);
        console.log('파일:', file ? file.name : '선택된 파일 없음');
        props.onHide(); // 모달 닫기
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <b>메뉴 추가</b>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col xs={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>카테고리 선택</Form.Label>
                                <Form.Select
                                    aria-label="카테고리 선택"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">카테고리 선택</option>
                                    {CategoryMockData.map((category, index) => (
                                        <option key={index} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={5}>
                            <Form.Group as={Col} controlId="menuName">
                                <Form.Label>메뉴 이름</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="메뉴 이름을 입력하세요"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Label>가격</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>₩</InputGroup.Text>
                                <Form.Control
                                    aria-label="가격"
                                    style={{ textAlign: 'right' }}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <InputGroup.Text>원</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>사진 추가</Form.Label>
                            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
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
}

export default MenuInsert;
