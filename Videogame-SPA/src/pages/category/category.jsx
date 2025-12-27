/**
 * Author: Joseph Juarez
 * Date: 12/10/2025
 * File: category.jsx
 * Description: this script creates the game component to display details of a specific game.
 */

import {settings} from "../../config/config";
import {useAuth} from "../../services/useAuth";
import useAxios from "../../services/useAxios";
import {useParams, useNavigate} from "react-router-dom";
import {Modal, Button} from 'react-bootstrap';
import "/src/assets/css/category.css";

const Category = () => {
    const {category_id} = useParams();
    const url = settings.baseApiUrl + "/categories/" + category_id;
    const {user} = useAuth();
    const navigate = useNavigate();
    const handleClose = () => { navigate("/categories") };

    // Fetch category data using the useAxios hook
    const {
        error,
        isLoading,
        data: category
    } = useAxios(url, "GET", {Authorization: "Bearer " + user.jwt});

    return (
        <>
            <Modal show={true} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <h4>{category && category.category_name}</h4>
                </Modal.Header>
                <Modal.Body>
                    {error && <div>{error}</div>}
                    {isLoading &&
                        <div className="image-loading">
                            Please wait while data is being loaded
                            <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                        </div>
                    }
                    {category &&
                        <div className="category-detail-container">
                            <div className="category-detail-row">
                                <div>ID</div><div>{category.category_id}</div>
                            </div>
                            <div className="category-detail-row">
                                <div>Name</div><div>{category.category_name}</div>
                            </div>
                            <div className="category-detail-row">
                                <div>Description</div><div>{category.description}</div>
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Category;