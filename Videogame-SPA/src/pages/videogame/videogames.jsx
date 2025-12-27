/**
 * Author: Joseph Juarez
 * Date: 11/13/2025
 * File: videogames.jsx
 * Description: Display videogames made by the publisher.
 */

import {settings} from "../../config/config";
import useXmlHttp from '../../services/useXmlHttp';
import {useParams} from "react-router-dom";
import '../../assets/css/videogame.css';
import {useAuth} from "../../services/useAuth";

const Videogames = () => {
    const {user} = useAuth();
    const {publisherId} = useParams();
    const url = settings.baseApiUrl + "/publishers/" + publisherId + "/videogames";
    const {
        error,
        isLoading,
        data
    } = useXmlHttp(url,"GET",{Authorization:`Bearer ${user.jwt}`});

    const videogames = data ? data.videogames : null;

    return (
        <>
            {error && <div>{error}</div>}

            {isLoading &&
                <div className="image-loading">
                    Please wait while data is being loaded
                    <img src="/src/assets/img/loading.gif" alt="Loading ......"/>
                </div>}

            {videogames && (videogames.length === 0
                    ? <p>Videogames were not found.</p>
                    : <div className="videogame-row videogame-row-header">
                        <div>Title</div>
                        <div>Release Year</div>
                        <div>ESRB Rating</div>
                        <div>Game Description</div>

                        <div>Multiplayer Support</div>
                    </div>
            )}

            {videogames && (
                videogames.map((videogame, index) => (
                    <div key={index} className="videogame-row">
                        <div>{videogame.title}</div>
                        <div>{videogame.release_year}</div>
                        <div>{videogame.esrb_rating}</div>
                        <div>{videogame.game_description}</div>

                        <div>
                            {videogame.is_multiplayer === 1
                                ? "Yes"
                                : "No"}
                        </div>

                    </div>
                ))
            )}

        </>
    );
};

export default Videogames;