import { useEffect, useState } from "react";
import Slider from "react-slick";
import { createClient } from "@supabase/supabase-js";

interface slideTypes {
  data: string[];
}

export const Slideshow = ({ data }: slideTypes) => {
  const [images, setImages] = useState<
    {
      publicUrl: string;
    }[]
  >([]);

  const supabase = createClient(
    import.meta.env.VITE_PROJECT_URL,
    import.meta.env.VITE_API_KEY
  );

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

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const imageUrls = await Promise.all(
          data.map(async (element) => {
            const { data } = await supabase.storage
              .from("BookingSystem/images/")
              .getPublicUrl(element);
            return data;
          })
        );
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <main className="mb-5">
      <Slider {...settings}>
        {images?.map((item: any, index: number) => (
          <div className="slide" key={index}>
            <img className="w-full" src={item.publicUrl} />
          </div>
        ))}
      </Slider>
    </main>
  );
};
