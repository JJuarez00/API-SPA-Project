/**
 * Name: Joseph Juarez
 * Date: 11/27/2025
 * File: editPlatform.jsx
 * Description: Edit Platform.
*/

import { useState, useEffect } from "react";
import UseFetch from "../../services/useFetch";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import JSONPretty from "react-json-pretty";
import "/src/assets/css/platform.css";

const EditPlatform =
    ({ showModal, setShowModal, data, reload, setReload, setSubHeading }) => {

        const { error, isLoading, data: response, update } = UseFetch();
        const navigate = useNavigate();
        const [submitted, setSubmitted] = useState(false);
        const [showButton, setShowButton] = useState(true);

        const { register, handleSubmit, formState: { errors } } = useForm({
            defaultValues: {
                platform_id: data?.platform_id ?? "",
                platform_name: data?.platform_name ?? "",
                form_factor: data?.form_factor ?? "",
                generation: data?.generation ?? "",
                release_year: data?.release_year ?? "",
                // if the list passes "Yes"/"No" from innerText, normalize it:
                is_backwards_compatible:
                    data?.is_backwards_compatible === "Yes" ? 1 :
                        data?.is_backwards_compatible === "No" ? 0 :
                            (data?.is_backwards_compatible ?? 0)
            },
            shouldUseNativeValidation: false
        });

        const editFormOptions = {
            platform_id: { required: "Platform ID is required" },
            platform_name: { required: "Platform Name is required" },
            form_factor: { required: "Form Factor is required" },
            generation: { required: "Generation is required" },
            release_year: { required: "Release Year is required" },
            is_backwards_compatible: { required: "Backwards Compatible is required" }
        };

        const handleUpdate = (platform) => {
            const payload = {
                ...platform,
                platform_id: Number(platform.platform_id),
                generation: Number(platform.generation),
                release_year: Number(platform.release_year),
                is_backwards_compatible: Number(platform.is_backwards_compatible)
            };

            update(payload);
            setSubmitted(true);
        };

        const handleCancel = () => {
            setShowModal(false);
            setSubHeading("All Platforms");
            navigate("/platforms");
        };

        const handleClose = () => {
            setShowModal(false);
            setShowButton(true);
            setSubmitted(false);
            setReload(!reload);
            setSubHeading("All Platforms");
            navigate("/platforms");
        };

        useEffect(() => {
            if (!submitted || error != null) setShowButton(true);
            else setShowButton(false);
        });

        return (
            <>
                <Modal show={showModal} onHide={handleClose} centered animation={false} backdrop="static">
                    <Modal.Header closeButton>
                        <h4>Edit Platform</h4>
                    </Modal.Header>

                    <Modal.Body>
                        {error && <JSONPretty data={error} style={{ color: "red" }} />}

                        {isLoading && (
                            <div className="image-loading">
                                Please wait while data is being loaded
                                <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                            </div>
                        )}

                        {response && <JSONPretty data={response} />}

                        {(!submitted || error != null) && (
                            <form className="form-platform" id="form-platform-edit" onSubmit={handleSubmit(handleUpdate)}>
                                <ul className="form-platform-errors">
                                    {errors?.platform_id && <li>{errors.platform_id.message}</li>}
                                    {errors?.platform_name && <li>{errors.platform_name.message}</li>}
                                    {errors?.form_factor && <li>{errors.form_factor.message}</li>}
                                    {errors?.generation && <li>{errors.generation.message}</li>}
                                    {errors?.release_year && <li>{errors.release_year.message}</li>}
                                    {errors?.is_backwards_compatible && <li>{errors.is_backwards_compatible.message}</li>}
                                </ul>

                                <div className="form-group">
                                    <label>Platform ID</label>
                                    <input name="platform_id" readOnly="readOnly"
                                        {...register("platform_id", editFormOptions.platform_id)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Platform Name</label>
                                    <input type="text" name="platform_name"
                                        {...register("platform_name", editFormOptions.platform_name)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Form Factor</label>
                                    <input type="text" name="form_factor"
                                        {...register("form_factor", editFormOptions.form_factor)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Generation</label>
                                    <input name="generation"
                                        {...register("generation", editFormOptions.generation)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Release Year</label>
                                    <input name="release_year"
                                        {...register("release_year", editFormOptions.release_year)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Backwards Compatible</label>
                                    <select name="is_backwards_compatible"
                                        {...register("is_backwards_compatible", editFormOptions.is_backwards_compatible)}>
                                        <option value={0}>No</option>
                                        <option value={1}>Yes</option>
                                    </select>
                                </div>
                            </form>
                        )}
                    </Modal.Body>

                    <Modal.Footer style={{ justifyContent: "center" }}>
                        <Button type="submit" form="form-platform-edit" variant="primary" style={{ display: (!showButton) ? "none" : "" }}>Update</Button>
                        <Button variant="secondary" onClick={handleCancel} style={{ display: (!showButton) ? "none" : "" }}>Cancel</Button>
                        <Button variant="primary" onClick={handleClose} style={{ display: (!showButton) ? "" : "none" }}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    };

export default EditPlatform;
