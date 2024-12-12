import styled from "styled-components";
import Carousel from "react-multi-carousel";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Div = ({ className, children }) => (
  <div className={className}>
    <Carousel responsive={responsive} >
      {children}
    </Carousel>
  </div>
);

export const CustomCarousel = styled(Div)`
  .react-multi-carousel-item {
    display: flex;
    justify-content: center;
  }

  .react-multiple-carousel__arrow {
    background: rgba(0, 0, 0, 0.1);
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%;
  }

  .react-multiple-carousel__arrow--left {
    left: 0;
  }

  .react-multiple-carousel__arrow--right {
    right: 0;
  }

  .react-multiple-carousel__arrow::before {
    font-size: 10px;
  }
`;