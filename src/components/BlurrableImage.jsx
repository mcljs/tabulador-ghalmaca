import * as React from 'react';
import clsx from 'clsx';

function BlurrableImage({ img, background, ...rest }) {
  const [visible, setVisible] = React.useState(false);
  const imgRef = React.useRef(null);

  const { src, srcSet, sizes } = img.props;
  React.useLayoutEffect(() => {
    if (imgRef.current?.complete) setVisible(true);
  }, []);

  React.useEffect(() => {
    if (!imgRef.current) return;
    if (imgRef.current.complete) return;

    let current = true;
    imgRef.current.addEventListener('load', () => {
      if (!imgRef.current || !current) return;
      setTimeout(() => {
        setVisible(true);
      }, 500);
    });
    /* eslint-disable*/
    return () => {
      current = false;
    };
  }, [src, srcSet, sizes]);

  const imgEl = React.cloneElement(img, {
    ref: imgRef,
    key: img.props.src,
    className: clsx(
      img.props.className,
      'z-10 object-cover transition-opacity',
      { 'opacity-0': !visible },
    ),
  });

  return (
    <>
      <div
        className={clsx(rest.className, 'w-full h-full')}
        style={
          visible === false
            ? {
                ...rest.style,
                backgroundSize: 'cover',
                backgroundColor: background || 'rgba(238, 242, 255, 1)',
                filter: `blur(3px)`,
              }
            : rest.style
        }
      >
        {imgEl}
      </div>
    </>
  );
}
export { BlurrableImage };
