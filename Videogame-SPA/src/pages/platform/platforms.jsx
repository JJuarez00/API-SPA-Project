/*
Name: Joseph Juarez
Date: 11/20/2025
File: platforms.jsx
Description: Creates the platform component to list all platforms.
*/

import { useEffect, useState } from 'react';
import UseFetch from "../../services/useFetch";
import JSONPretty from 'react-json-pretty';
import "/src/assets/css/platform.css";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../services/useAuth";
import EditPlatform from './editPlatform';
import CreatePlatform from './createPlatform';
import DeletePlatform from './deletePlatform';

const Platforms = () => {
    const { error, isLoading, data: platforms, getAll, search } = UseFetch();
    const [subHeading, setSubHeading] = useState("All Platforms");

    const navigate = useNavigate();
    const [activePlatform, setActivePlatform] = useState(""); // platform being edited/deleted
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reload, setReload] = useState(false);

    const { user } = useAuth();
    const disabled = (user.role !== 1);

    useEffect(() => {
        getAll();
    }, [reload]);

    const handleSearch = (e) => {
        e.preventDefault();
        const term = document.getElementById("platform-search-term").value;

        if (term === '') setSubHeading("All Platforms");
        else if (isNaN(term)) setSubHeading("Platforms containing '" + term + "'");
        else setSubHeading("Platforms whose generation is >= " + term);

        search(term);
    };

    const clearSearchBox = (e) => {
        e.preventDefault();
        document.getElementById("platform-search-term").value = "";
        setSubHeading("All Platforms");
        search("");
    };

    const platformList = Array.isArray(platforms)
        ? platforms
        : (Array.isArray(platforms?.data) ? platforms.data : []);

    const handleEdit = (e) => {
        if (disabled) return;

        let platform = {};
        ["platform_id", "platform_name", "form_factor", "generation", "release_year", "is_backwards_compatible"]
            .forEach(function (key) {
                platform[key] =
                    document.getElementById(`platform-${key}-` + e.target.id).innerText;
            });

        // Normalize backwards compatible (DOM has Yes/No)
        platform.is_backwards_compatible =
            platform.is_backwards_compatible === "Yes" ? 1 :
                platform.is_backwards_compatible === "No" ? 0 :
                    platform.is_backwards_compatible;

        setActivePlatform(platform);
        navigate("/platforms/" + e.target.id);
        setShowEditModal(true);
    };

    const handleCreate = () => {
        if (disabled) return;
        setShowCreateModal(true);
    };

    const handleDelete = (e) => {
        if (disabled) return;

        let platform = {};
        ["platform_id", "platform_name", "form_factor", "generation", "release_year", "is_backwards_compatible"]
            .forEach(function (key) {
                platform[key] =
                    document.getElementById(`platform-${key}-` + e.target.id).innerText;
            });

        platform.is_backwards_compatible =
            platform.is_backwards_compatible === "Yes" ? 1 :
                platform.is_backwards_compatible === "No" ? 0 :
                    platform.is_backwards_compatible;

        setActivePlatform(platform);
        navigate("/platforms/" + e.target.id);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setSubHeading("All Platforms");
        navigate("/platforms");
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setSubHeading("All Platforms");
        navigate("/platforms");
    };

    return (
        <>
            <div className="main-heading">
                <div className="container">Platform</div>
            </div>
            <div className="sub-heading">
                <div className="container">{subHeading}</div>
            </div>

            <div className="main-content container">
                {error && <JSONPretty data={error} />}

                {isLoading && (
                    <div className="image-loading">
                        Please wait while data is being loaded
                        <img src="/src/assets/img/loading.gif" alt="Loading..." />
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="platform-container">

                        {/* SEARCH FORM */}
                        <form className="platform-search-form" onSubmit={handleSearch}>
                            <input id="platform-search-term" placeholder="Enter search terms" />
                            <button type="submit" className="button-light">Search</button>
                            <button className="button-light" onClick={clearSearchBox}>Clear</button>
                        </form>

                        {/* Header Row */}
                        <div className="platform-row platform-row-header">
                            <div className="platform-info">
                                <div className="platform-id">ID</div>
                                <div className="platform-name">Name</div>
                                <div className="platform-form-factor">Form Factor</div>
                                <div className="platform-generation">Generation</div>
                                <div className="platform-release-year">Release Year</div>
                                <div className="platform-backwards">Backwards Compatible</div>
                            </div>
                            <div className="platform-buttons">Actions</div>
                        </div>

                        {/* Data Rows */}
                        {platformList.length > 0 ? (
                            platformList.map((platform) => (
                                <div key={platform.platform_id} className="platform-row">
                                    <div className="platform-info">
                                        <div id={"platform-platform_id-" + platform.platform_id} className="platform-id">{platform.platform_id}</div>
                                        <div id={"platform-platform_name-" + platform.platform_id} className="platform-name">{platform.platform_name}</div>
                                        <div id={"platform-form_factor-" + platform.platform_id} className="platform-form-factor">{platform.form_factor}</div>
                                        <div id={"platform-generation-" + platform.platform_id} className="platform-generation">{platform.generation}</div>
                                        <div id={"platform-release_year-" + platform.platform_id} className="platform-release-year">{platform.release_year}</div>

                                        <div id={"platform-is_backwards_compatible-" + platform.platform_id} className="platform-backwards">
                                            {platform.is_backwards_compatible ? "Yes" : "No"}
                                        </div>
                                    </div>

                                    <div className="platform-buttons">
                                        <button className="button-light" id={platform.platform_id} disabled={disabled} onClick={handleEdit}>
                                            Edit
                                        </button>

                                        <button className="button-light" id={platform.platform_id} disabled={disabled} onClick={handleDelete}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                No platforms found.
                                {platforms && !Array.isArray(platforms) && <JSONPretty data={platforms} />}
                            </div>
                        )}

                    </div>
                )}

                {/* MODALS */}
                {showEditModal && (
                    <EditPlatform
                        showModal={showEditModal}
                        setShowModal={(val) => {
                            setShowEditModal(val);
                            if (!val) handleCloseEdit();
                        }}
                        data={activePlatform}
                        reload={reload}
                        setReload={setReload}
                        setSubHeading={setSubHeading}
                    />
                )}

                {showCreateModal && (
                    <CreatePlatform
                        showModal={showCreateModal}
                        setShowModal={setShowCreateModal}
                        reload={reload}
                        setReload={setReload}
                        setSubHeading={setSubHeading}
                    />
                )}

                {showDeleteModal && (
                    <DeletePlatform
                        showModal={showDeleteModal}
                        setShowModal={(val) => {
                            setShowDeleteModal(val);
                            if (!val) handleCloseDelete();
                        }}
                        data={activePlatform}
                        reload={reload}
                        setReload={setReload}
                        setSubHeading={setSubHeading}
                    />
                )}

                <div>
                    <button className="button-create" disabled={disabled} onClick={handleCreate}>
                        Create Platform
                    </button>
                </div>

                <Outlet/>
            </div>
        </>
    );
};

export default Platforms;