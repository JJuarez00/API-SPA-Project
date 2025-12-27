/**
 * Name: Joseph Juarez
 * Date: 11/27/2025
 * File: createPlatform.jsx
 * Description: Creates a Platform.
*/

import { useState, useEffect } from "react";
import UseFetch from "../../services/useFetch";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import JSONPretty from "react-json-pretty";
import "/src/assets/css/platform.css";

const CreatePlatform =
    ({ showModal, setShowModal, reload, setReload, setSubHeading }) => {

        const { error, isLoading, data: response, create } = UseFetch();
        const [submitted, setSubmitted] = useState(false);
        const [showButton, setShowButton] = useState(true);

        const { register, handleSubmit, formState: { errors } } = useForm({
            defaultValues: {
                platform_id: "",
                platform_name: "",
                form_factor: "",
                generation: "",
                release_year: "",
                is_backwards_compatible: 0
            },
            shouldUseNativeValidation: false
        });

        const createFormOptions = {
            platform_id: { required: "Platform ID is required" },
            platform_name: { required: "Platform Name is required" },
            form_factor: { required: "Form Factor is required" },
            generation: { required: "Generation is required" },
            release_year: { required: "Release Year is required" },
            is_backwards_compatible: { required: "Backwards Compatible is required" }
        };

        const handleCreate = (platform) => {
            // Make sure these numeric fields go as numbers (API usually expects ints)
            const payload = {
                ...platform,
                platform_id: Number(platform.platform_id),
                generation: Number(platform.generation),
                release_year: Number(platform.release_year),
                is_backwards_compatible: Number(platform.is_backwards_compatible)
            };

            create(payload);
            setSubmitted(true);
        };

        const handleCancel = () => {
            setShowModal(false);
            setSubHeading("All Platforms");
        };

        const handleClose = () => {
            setShowModal(false);
            setShowButton(true);
            setSubmitted(false);
            setReload(!reload);
            setSubHeading("All Platforms");
        };

        useEffect(() => {
            if (!submitted || error != null) setShowButton(true);
            else setShowButton(false);
        });

        return (
            <>
                <Modal
                    show={showModal}
                    onHide={handleClose}
                    centered
                    animation={false}
                    backdrop="static">

                    <Modal.Header closeButton>
                        <h4>Create Platform</h4>
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
                            <form
                                className="form-platform"
                                id="form-platform-create"
                                onSubmit={handleSubmit(handleCreate)}>

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
                                    <input
                                        name="platform_id"
                                        {...register("platform_id", createFormOptions.platform_id)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Platform Name</label>
                                    <input
                                        type="text"
                                        name="platform_name"
                                        {...register("platform_name", createFormOptions.platform_name)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Form Factor</label>
                                    <input
                                        type="text"
                                        name="form_factor"
                                        {...register("form_factor", createFormOptions.form_factor)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Generation</label>
                                    <input
                                        name="generation"
                                        {...register("generation", createFormOptions.generation)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Release Year</label>
                                    <input
                                        name="release_year"
                                        {...register("release_year", createFormOptions.release_year)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Backwards Compatible</label>
                                    <select
                                        name="is_backwards_compatible"
                                        {...register("is_backwards_compatible", createFormOptions.is_backwards_compatible)}>

                                        <option value={0}>No</option>
                                        <option value={1}>Yes</option>
                                    </select>
                                </div>
                            </form>
                        )}
                    </Modal.Body>

                    <Modal.Footer style={{ justifyContent: "center" }}>
                        <Button variant="primary" form="form-platform-create" type="submit" style={{ display: (!showButton) ? "none" : "" }}>
                            Create
                        </Button>

                        <Button variant="secondary" onClick={handleCancel} style={{ display: (!showButton) ? "none" : "" }}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleClose} style={{ display: (!showButton) ? "" : "none" }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    };

export default CreatePlatform;