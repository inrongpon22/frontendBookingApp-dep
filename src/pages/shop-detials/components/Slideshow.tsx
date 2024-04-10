import React from "react";

interface slideTypes {
  data: string[];
}

export const Slideshow = ({ data }: slideTypes) => {
  const delay = 5000;
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef<any>(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === data.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {data?.map((item: any, index: number) => (
          <div className="slide" key={index}>
            <img className="w-full" src={item} />
          </div>
        ))}
      </div>

      <div className="slideshowDots">
        {data?.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
