import { useEffect, useState } from "react";
import Slider from "react-slick";
// import { useTranslation } from "react-i18next";
import { supabase } from "../../helper/createSupabase";

interface slideTypes {
  data: string[];
  fixedHeight?: number;
}

// const languageLists: {
//   code: string;
//   name: string;
// }[] = [
//   {
//     code: "en",
//     name: "English",
//   },
//   {
//     code: "th",
//     name: "Thai",
//   },
// ];

export const Slideshow = ({ data, fixedHeight }: slideTypes) => {
  const [images, setImages] = useState<
    {
      publicUrl: string;
    }[]
  >([]);

  // const {
  //   i18n: { changeLanguage, language },
  // } = useTranslation();

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
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

    if (data !== undefined) {
      fetchImageUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <main className="relative mb-5">
      {/* <div className="absolute right-3 top-3 z-50">
        <select
          value={language}
          className="bg-white rounded border"
          onChange={(e) => {
            changeLanguage(e.target.value)
            localStorage.setItem("lang", e.target.value)
          }}
        >
          {languageLists.map((item: any, index: number) => {
            return (
              <option key={index} value={item.code}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div> */}
      <Slider {...settings}>
        {images?.map((item: any, index: number) => (
          <div className="slide" key={index}>
            <img
              className={`w-full object-cover`}
              src={item.publicUrl}
              style={{ height: `${fixedHeight}px` }}
            />
          </div>
        ))}
      </Slider>
    </main>
  );
};
