import Slider from "react-slick";

interface slideTypes {
  data: string[];
}

export const Slideshow = ({ data }: slideTypes) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <main className="mb-5">
      <Slider {...settings}>
        {data?.map((item: any, index: number) => (
          <div className="slide" key={index}>
            <img className="w-full" src={item} />
          </div>
        ))}
      </Slider>
    </main>
  );
};
