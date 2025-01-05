import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./homeStyle.css";

const HeroSection = () => {
    return (
        <div className="hero-section">
            <Carousel
                autoPlay
                infiniteLoop
                showArrows={false}
                showThumbs={false}
                showStatus={false}
                interval={2500}
                transitionTime={700}
                axis="vertical"
                centerMode={false}
            >
                <div>
                    <img src="/carousal/hero-image1.png" alt="Slide-1" />
                </div>
                <div>
                    <img src="/carousal/hero-image2.jpg" alt="Slide-2" />
                </div>
                <div>
                    <img src="/carousal/hero-image3.png" alt="Slide-3" />
                </div>
                <div>
                    <img src="/carousal/hero-image4.jpg" alt="Slide-4" />
                </div>
                <div>
                    <img src="/carousal/hero-image5.png" alt="Slide-5" />
                </div>
                <div>
                    <img src="/carousal/hero-image6.png" alt="Slide-6" />
                </div>
            </Carousel>
        </div>
    );
};

export default HeroSection;
