import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Icon } from '@scuf/common';
import PropTypes from 'prop-types';
import "pure-react-carousel/dist/react-carousel.es.css";
import ErrorBoundary from '../../ErrorBoundary';

const Carousel = (props) => {

    const getVisibleSlides = () => {
        let screenWidth = window.screen.width;
        if (screenWidth < 768) {
            return 1
        }
        else if (screenWidth >= 768 && screenWidth < 992) {
            return props.visibleSlides.tablet ? props.visibleSlides.tablet : 2;
        }
        else if (screenWidth >= 992 && screenWidth < 1600) {
            return props.visibleSlides.laptop ? props.visibleSlides.laptop : 3;
        }
        else {
            return props.visibleSlides.desktop ? props.visibleSlides.desktop : 4;
        }
    }

    return (
        <ErrorBoundary>
            <CarouselProvider
                naturalSlideWidth={props.slideWidth}
                totalSlides={props.items.length}
                visibleSlides={getVisibleSlides()}
                naturalSlideHeight={props.slideHeight}
            >
                {/* adding enclosing div to place back and next button along the slides*/}
                <div style={{ "position": "relative" }}>
                    <Slider className='slider'>
                        {
                            props.items.map((item, index) => (
                                <Slide key={index} index={index}>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        {props.renderItem(item)}
                                    </div>
                                </Slide>
                            ))
                        }
                    </Slider>
                    <ButtonBack className="carousel-back-button">
                        <Icon root="common" className='carousel-next-prev-icon' name="caret-left" size="large" />
                    </ButtonBack>
                    <ButtonNext className="carousel-next-button">
                        <Icon root="common" className='carousel-next-prev-icon' name="caret-right" size="large" />
                    </ButtonNext>
                </div>
            </CarouselProvider>
        </ErrorBoundary>
    )
}

Carousel.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    slideWidth: PropTypes.number,
    slideHeight: PropTypes.number,
    visibleSlides: PropTypes.object
}

Carousel.defaultProps = {
    slideWidth: 100,
    slideHeight: 100
}

export default Carousel;