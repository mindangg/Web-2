import video from '../assets/video/video.mp4'
import '../styles/IntroduceVideo.css'
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

const IntroduceVideo = () => {
    return (
        <div className="container-fluid p-0">
            <div className="video-container position-relative overflow-hidden" style={{ height: '70vh' }}>
                <video
                    autoPlay
                    muted
                    loop
                    className="w-100 h-100 position-absolute top-50 start-50 translate-middle"
                >
                    <source src={video} type="video/mp4"/>
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
                <div className="overlay-text rounded-4 position-absolute top-50 start-50 translate-middle text-center text-white">
                    <h1 className="display-4 fw-bold">SGU Mobile</h1>
                    <p className="lead">Khám phá tuyệt tác công nghệ</p>
                    <Link to={'/product/16'}>
                        <Button className="btn-outline-light mt-3 align-content-center">
                            Mua ngay
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default IntroduceVideo;